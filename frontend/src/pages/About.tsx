import { Calendar, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const features = [
    {
      icon: Calendar,
      title: "Diverse Events",
      description: "From college fests to concerts, workshops to festivals - discover events that match your interests.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of event enthusiasts and organizers building memorable experiences together.",
    },
    {
      icon: Target,
      title: "Easy Booking",
      description: "Seamless ticket booking process with secure payments and instant confirmations.",
    },
    {
      icon: Heart,
      title: "Passionate Team",
      description: "We're dedicated to connecting people through amazing events and unforgettable moments.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Events Hosted" },
    { value: "1M+", label: "Happy Attendees" },
    { value: "5K+", label: "Event Organizers" },
    { value: "150+", label: "Cities Covered" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-primary mb-4">About OpenEvent</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting people through unforgettable experiences, one event at a time.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-accent mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At OpenEvent, we believe that events have the power to bring people together, create lasting memories, 
              and build vibrant communities. Our platform makes it easy for anyone to discover, organize, and attend 
              amazing events - from small-scale workshops to large-scale festivals.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold bg-gradient-primary bg-clip-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">What Makes Us Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-glow hover:border-primary/50 transition-all group">
                  <CardContent className="pt-6">
                    <div className="inline-flex p-4 bg-gradient-primary rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-accent text-center">Our Story</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                OpenEvent was born from a simple idea: what if finding and attending events could be as easy as 
                browsing your favorite social media? Our founders, a group of event enthusiasts and tech innovators, 
                came together in 2023 with a vision to revolutionize how people discover and experience events.
              </p>
              <p>
                Starting with a handful of college events, we've grown into a comprehensive platform serving thousands 
                of organizers and millions of attendees across the globe. Our journey has been fueled by the incredible 
                feedback and support from our community.
              </p>
              <p>
                Today, OpenEvent is more than just a ticketing platform - it's a thriving ecosystem where event 
                creators can bring their visions to life, and attendees can discover experiences that inspire, 
                educate, and entertain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-primary/30 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-4 text-primary">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly push boundaries to create better experiences for organizers and attendees alike.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-accent/30 hover:border-accent transition-colors">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-4 text-accent">Community</h3>
                <p className="text-muted-foreground">
                  Building meaningful connections between people is at the heart of everything we do.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-success/30 hover:border-success transition-colors">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-4 text-success">Trust</h3>
                <p className="text-muted-foreground">
                  We prioritize security, transparency, and reliability in every interaction on our platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
