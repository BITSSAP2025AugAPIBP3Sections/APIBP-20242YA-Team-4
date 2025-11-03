import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [role, setRole] = useState("attendee");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (password !== reEnterPassword) {
            toast.error("Passwords do not match!");
            return;
          }
    setIsLoading(true);

    // TODO: Implement actual update logic
   setTimeout(() => {
         toast.success("Sign-up successful!");
         setIsLoading(false);

         if (role === "organizer") {
           navigate("/event-organizer");
         }
       }, 1000);
     };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {user?.role === "organizer" ? "Event Organizer" : "Event Attendee"}
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Account Information</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                required
              />
            </div>
            <div className="space-y-2"
            onClick={(e) => e.stopPropagation()}>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
             </div>
              <div className="space-y-2"
              onClick={(e) => e.stopPropagation()}>
                         <Label htmlFor="reEnterPassword">Re-enter Password</Label>
                         <Input
                           id="reEnterPassword"
                           type="password"
                           value={reEnterPassword}
                           onChange={(e) => setReEnterPassword(e.target.value)}
                           required
                         />
               </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <select
                id="role"
                value={user?.role}
                onChange={(e) => console.log(e.target.value)} // Replace with your handler
                className="bg-muted block w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="organizer">Event Organizer</option>
                <option value="attendee">Event Attendee</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Sign Up"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
