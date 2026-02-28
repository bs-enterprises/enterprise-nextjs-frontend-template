import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Save, Camera, Mail, Phone, MapPin, Briefcase, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your public profile and personal information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Avatar & Role Card */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    AU
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
              <Badge variant="secondary" className="text-xs">Administrator</Badge>
              <Button variant="outline" size="sm" className="w-full mt-1 text-xs">
                Change Avatar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Member since</p>
                  <p>January 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Account Status</p>
                  <p className="text-green-600 dark:text-green-400">Active & Verified</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Department</p>
                  <p>Platform Engineering</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-medium">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-medium">Last Name</Label>
                  <Input id="lastName" defaultValue="User" className="h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-xs font-medium">Display Name</Label>
                <Input id="displayName" defaultValue="Admin User" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-medium">Bio</Label>
                <Input
                  id="bio"
                  placeholder="A short description about yourself..."
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email
                </Label>
                <Input id="email" type="email" defaultValue="admin@example.com" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs font-medium flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </Label>
                <Input id="location" placeholder="City, Country" className="h-10" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
