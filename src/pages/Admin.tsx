import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, UserCheck, LogOut, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [attendees, setAttendees] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async () => {
    setLoading(true);
    console.log('Attempting admin login...');
    try {
      const response = await supabase.functions.invoke('secure-admin-auth', {
        body: { 
          action: 'login',
          secret: secretCode,
          userAgent: navigator.userAgent
        }
      });

      console.log('Login response:', response);

      if (response.error) {
        console.error('Response error:', response.error);
        throw new Error(response.error.message);
      }

      const { success, sessionToken: newToken, expiresAt, error } = response.data;

      if (success && newToken) {
        setIsAuthenticated(true);
        setSessionToken(newToken);
        setSessionExpiry(expiresAt);
        setLoginAttempts(0);
        
        // Store session securely (with expiry check)
        localStorage.setItem('admin_session', JSON.stringify({
          token: newToken,
          expiresAt
        }));
        
        fetchData();
        toast({
          title: "Access granted",
          description: "Welcome to the secure admin panel",
        });
      } else {
        setLoginAttempts(prev => prev + 1);
        toast({
          title: "Access denied",
          description: error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setLoginAttempts(prev => prev + 1);
      toast({
        title: "Authentication error", 
        description: "Failed to validate credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        await supabase.functions.invoke('secure-admin-auth', {
          body: { 
            action: 'logout',
            sessionToken
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setIsAuthenticated(false);
    setSessionToken(null);
    setSessionExpiry(null);
    localStorage.removeItem('admin_session');
    setSecretCode('');
    navigate('/');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch attendees
      const { data: attendeeData, error: attendeeError } = await supabase
        .from('attendee')
        .select('*')
        .order('createdat', { ascending: false });

      if (attendeeError) {
        console.error('Error fetching attendees:', attendeeError);
      } else {
        setAttendees(attendeeData || []);
      }

      // Fetch interests
      const { data: interestData, error: interestError } = await supabase
        .from('interest')
        .select('*')
        .order('createdat', { ascending: false });

      if (interestError) {
        console.error('Error fetching interests:', interestError);
      } else {
        setInterests(interestData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch registration data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifySession = async (token: string) => {
    try {
      const response = await supabase.functions.invoke('secure-admin-auth', {
        body: { 
          action: 'verify',
          sessionToken: token
        }
      });

      const { success } = response.data;
      if (success) {
        setIsAuthenticated(true);
        setSessionToken(token);
        fetchData();
        return true;
      }
    } catch (error) {
      console.error('Session verification failed:', error);
    }
    return false;
  };

  useEffect(() => {
    // TEMPORARY: Auto-authenticate for testing
    const autoAuth = async () => {
      console.log('🔧 TEMPORARY: Auto-authenticating for testing...');
      try {
        const response = await supabase.functions.invoke('secure-admin-auth', {
          body: { 
            action: 'login',
            secret: 'test', // dummy value since validation is bypassed
            userAgent: navigator.userAgent
          }
        });

        if (response.data?.success) {
          setIsAuthenticated(true);
          setSessionToken(response.data.sessionToken);
          setSessionExpiry(response.data.expiresAt);
          fetchData();
          toast({
            title: "Auto-authenticated for testing",
            description: "Admin panel accessed automatically",
          });
        }
      } catch (error) {
        console.error('Auto-auth failed:', error);
      }
    };

    // Check for existing session first
    const sessionData = localStorage.getItem('admin_session');
    if (sessionData) {
      try {
        const { token, expiresAt } = JSON.parse(sessionData);
        
        // Check if session is expired
        if (new Date(expiresAt) > new Date()) {
          setSessionExpiry(expiresAt);
          verifySession(token);
        } else {
          // Clean up expired session and auto-auth
          localStorage.removeItem('admin_session');
          autoAuth();
        }
      } catch (error) {
        console.error('Invalid session data:', error);
        localStorage.removeItem('admin_session');
        autoAuth();
      }
    } else {
      // No existing session, auto-auth for testing
      autoAuth();
    }
    
    // Cleanup expired sessions periodically
    const cleanup = setInterval(() => {
      supabase.functions.invoke('secure-admin-auth', {
        body: { action: 'cleanup' }
      });
    }, 60000); // Every minute

    return () => clearInterval(cleanup);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <Layout currentPage="admin">
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 rounded-full bg-primary/10 text-primary w-fit mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <p className="text-muted-foreground">Enter the secret code to continue</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {loginAttempts >= 3 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Multiple failed attempts detected. Access may be temporarily restricted.
                  </AlertDescription>
                </Alert>
              )}
              <Input
                type="password"
                placeholder="Secret code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleAuth()}
                disabled={loading}
              />
              <Button 
                onClick={handleAuth} 
                className="w-full" 
                disabled={loading || loginAttempts >= 5}
              >
                {loading ? "Validating..." : loginAttempts >= 5 ? "Too Many Attempts" : "Access Secure Admin Panel"}
              </Button>
              {loginAttempts >= 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  Account temporarily locked. Please try again later.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Secure Admin Dashboard</h1>
            <p className="text-muted-foreground">Conference registration management</p>
            {sessionExpiry && (
              <p className="text-xs text-muted-foreground mt-1">
                Session expires: {new Date(sessionExpiry).toLocaleString()}
              </p>
            )}
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Secure Logout
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Registrations</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendees.length}</div>
              <p className="text-xs text-muted-foreground">Full conference attendees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interest Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{interests.length}</div>
              <p className="text-xs text-muted-foreground">Newsletter subscribers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendees.length + interests.length}</div>
              <p className="text-xs text-muted-foreground">All registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="attendees" className="w-full">
          <TabsList>
            <TabsTrigger value="attendees">Paid Attendees ({attendees.length})</TabsTrigger>
            <TabsTrigger value="interests">Interest List ({interests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="attendees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conference Attendees</CardTitle>
                <p className="text-muted-foreground">Paid registrations with payment status</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Affiliation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                          <TableCell className="font-medium">{attendee.name}</TableCell>
                          <TableCell>{attendee.email}</TableCell>
                          <TableCell>{attendee.affiliation || 'Not specified'}</TableCell>
                          <TableCell>
                            <Badge className={`text-white ${getStatusColor(attendee.status)}`}>
                              {attendee.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(attendee.createdat)}</TableCell>
                          <TableCell>
                            {attendee.stripepaymentintentid ? (
                              <Badge variant="outline" className="text-green-600">Paid</Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600">Pending</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {attendees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No paid registrations yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interest Registrations</CardTitle>
                <p className="text-muted-foreground">Users who signed up for updates</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Affiliation</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Registration Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interests.map((interest) => (
                        <TableRow key={interest.id}>
                          <TableCell className="font-medium">{interest.name}</TableCell>
                          <TableCell>{interest.email}</TableCell>
                          <TableCell>{interest.affiliation || 'Not specified'}</TableCell>
                          <TableCell>{interest.notes || 'None'}</TableCell>
                          <TableCell>{formatDate(interest.createdat)}</TableCell>
                        </TableRow>
                      ))}
                      {interests.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No interest registrations yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;