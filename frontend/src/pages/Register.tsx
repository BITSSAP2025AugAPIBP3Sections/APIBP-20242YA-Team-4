import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, RegisterData } from "@/lib/api-service";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [role, setRole] = useState("ATTENDEE");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (password !== reEnterPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!fullName || !username || !email || !password) {
      toast.error("Please fill all fields!");
      return;
    }

    setIsLoading(true);

    try {
      const registerData: RegisterData = {
        username,
        email,
        password,
        fullName,
        role,
      };

      await authAPI.register(registerData);
      
      toast.success("Registration successful! Please login.");
      navigate("/login");
      
    } catch (error) {
      console.error("Registration error:", error);
      
      // Detailed error logging
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.log('❌ Status:', axiosError.response?.status);
        console.log('❌ Status Text:', axiosError.response?.statusText);
        console.log('❌ Response Data:', axiosError.response?.data);
        console.log('❌ Request URL:', axiosError.config?.url);
        
        const errorMessage = axiosError.response?.data?.error || 
                           axiosError.response?.data?.message || 
                           axiosError.message || 
                           "Registration failed";
        toast.error(errorMessage);
      } else {
        console.log('❌ Unknown error:', error);
        toast.error("Registration failed - Please check if backend is running");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600">Join our event platform today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reEnterPassword">Re-enter Password</Label>
              <Input
                id="reEnterPassword"
                type="password"
                value={reEnterPassword}
                onChange={(e) => setReEnterPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="ATTENDEE">Event Attendee</option>
                <option value="ORGANIZER">Event Organizer</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
            
            {/* Debug: Test backend connection */}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={async () => {
                try {
                  console.log('🧪 Testing backend connection...');
                  const response = await fetch('http://localhost:8080/actuator/health');
                  console.log('✅ Backend connection test:', response.status, response.statusText);
                  if (response.ok) {
                    toast.success('✅ Backend is running!');
                  } else {
                    toast.error(`❌ Backend responded with: ${response.status}`);
                  }
                } catch (error) {
                  console.error('❌ Backend connection failed:', error);
                  toast.error('❌ Cannot connect to backend - is it running on port 8080?');
                }
              }}
            >
              🧪 Test Backend Connection
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;
