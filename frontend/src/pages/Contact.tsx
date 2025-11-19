import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">

          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">Contact Information</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Reach out to us through any of these channels. We're here to help make your event experience amazing.
            </p>
          </div>

          {/* Info Cards in Horizontal Row */}
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
            
            {/* Email */}
            <Card className="flex-1 shadow-lg">
              <CardContent className="flex flex-col items-center pt-8 pb-8 space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-muted-foreground">info@openevent.com</p>
                <p className="text-muted-foreground">support@openevent.com</p>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="flex-1 shadow-lg">
              <CardContent className="flex flex-col items-center pt-8 pb-8 space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-muted-foreground">+91 555-123-4567</p>
                <p className="text-muted-foreground">Mon–Fri, 9am–6pm IST</p>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="flex-1 shadow-lg">
              <CardContent className="flex flex-col items-center pt-8 pb-8 space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Office</h3>
                <p className="text-muted-foreground">123 Event Street</p>
                <p className="text-muted-foreground">Whitefield, Bangalore, India</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
