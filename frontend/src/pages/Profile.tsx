import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { attendeeAPI } from "@/lib/api-service";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Load real profile from backend
  useEffect(() => {
    if (!user) return;
    setName(user.fullName);
    setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Update profile (name and email)
      const updated = await attendeeAPI.updateProfile(user.id, {
        fullName: name,
        email: email,
      });

      // Update localStorage with new user data
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, fullName: name, email: email };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Refresh user context
      if (refreshUser) {
        await refreshUser();
      }

      toast.success("Profile updated successfully!");

      // Handle password change separately if password fields are filled
      if (currentPassword && password && reEnterPassword) {
        if (password !== reEnterPassword) {
          toast.error("New passwords do not match!");
          setIsLoading(false);
          return;
        }

        // Call password change API
        try {
          await attendeeAPI.changePassword(user.id, currentPassword, password);
          toast.success("Details updated successfully!");
          
          // Clear password fields
          setCurrentPassword("");
          setPassword("");
          setReEnterPassword("");
        } catch (pwdError) {
          console.error("Password change error:", pwdError);
          toast.error("Failed to change password. Check your current password.");
        }
      }

    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Profile</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-10 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{name}</h2>
            <p className="text-muted-foreground mb-3">{email}</p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {user?.role === "ORGANIZER" ? "Event Organizer" : "Event Attendee"}
            </div>

          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-6">Change Password (Optional)</h3>
                
                <div className="space-y-2 mb-6">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repassword">Re-enter New Password</Label>
                  <Input
                    id="repassword"
                    type="password"
                    value={reEnterPassword}
                    onChange={(e) => setReEnterPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover mt-8"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
