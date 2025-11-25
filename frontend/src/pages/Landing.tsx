import { Button } from '@/components/ui/button';
import { CheckCircle2, BookOpen, Calendar, Target, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: BookOpen,
      title: 'Organize Subjects',
      description: 'Keep all your courses organized with custom colors and schedules',
    },
    {
      icon: Target,
      title: 'Track Tasks',
      description: 'Never miss a deadline with our intuitive task management system',
    },
    {
      icon: Calendar,
      title: 'Plan Ahead',
      description: 'Visualize your workload with our interactive calendar view',
    },
    {
      icon: Users,
      title: 'Stay Focused',
      description: 'Track your study time and build consistent study habits',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              StudyBuddy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Your intelligent companion for academic success. Organize subjects, track assignments, and ace your studies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="text-lg"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-lg"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              StudyBuddy provides all the tools you need to stay organized and achieve your academic goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why students love StudyBuddy
              </h2>
            </div>

            <div className="space-y-6">
              {[
                'Stay on top of all your assignments and deadlines',
                'Visualize your workload with intuitive calendars',
                'Track your progress and build study streaks',
                'Access your study materials from anywhere',
                'Get organized in minutes, not hours',
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your study routine?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who are already studying smarter with StudyBuddy
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="text-lg"
            >
              Start Free Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 StudyBuddy. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
