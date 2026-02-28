import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, User, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="bg-muted/50 w-full justify-start">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" className="h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="admin@example.com" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself..." className="h-10" />
              </div>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
              <CardDescription>Your organization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" defaultValue="My Organization" className="h-10" />
              </div>
              <div className="flex items-center gap-2">
                <Label>Plan</Label>
                <Badge variant="secondary">Enterprise</Badge>
              </div>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', description: 'Receive notifications via email', enabled: true },
                  { label: 'Push Notifications', description: 'Browser push notifications', enabled: false },
                  { label: 'Marketing Emails', description: 'Product updates and announcements', enabled: true },
                  { label: 'Security Alerts', description: 'Alerts for suspicious activity', enabled: true },
                  { label: 'Weekly Digest', description: 'Weekly summary of activity', enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <div
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        item.enabled ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
                          item.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription>Ensure your account uses a strong password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" className="h-10" />
              </div>
              <Button size="sm">Update Password</Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Authenticator App</p>
                  <p className="text-xs text-muted-foreground">Not configured</p>
                </div>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button
                      key={theme}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors hover:border-primary ${
                        theme === 'System' ? 'border-primary bg-primary/5' : 'border-border/50'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-3 block">Sidebar</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Default', desc: 'With menu picker' },
                    { label: 'Expanded', desc: 'Show all menus' },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      className="p-3 rounded-lg border border-border/50 text-left hover:border-primary transition-colors"
                    >
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
