import { BottomNav } from '@/components/bottom-nav';
import { Settings, Bell, Heart, Share2, HelpCircle, LogOut } from 'lucide-react';

const menuItems = [
  { icon: Settings, label: "Preferences", href: "#preferences" },
  { icon: Bell, label: "Notifications", href: "#notifications" },
  { icon: Heart, label: "Favorite Recipes", href: "#favorites" },
  { icon: Share2, label: "Share App", href: "#share" },
  { icon: HelpCircle, label: "Help & Support", href: "#help" },
  { icon: LogOut, label: "Sign Out", href: "#signout" }
];

const childProfile = {
  name: "Arjun",
  age: 7,
  region: "Maharashtra",
  dietaryPreferences: ["Vegetarian"],
  allergies: ["Peanuts"],
  favoriteFood: ["Idli", "Dosa", "Khichdi"]
};

export default function ProfilePage() {
  return (
    <div className="pb-16">
      <header className="p-4 bg-gradient-to-b from-green-600 to-green-700">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm opacity-80">Manage your preferences</p>
      </header>

      <section className="p-4">
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold">
              {childProfile.name[0]}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{childProfile.name}</h2>
              <p className="text-sm text-gray-400">{childProfile.age} years old</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-3">Dietary Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Region</span>
              <span>{childProfile.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Diet Type</span>
              <span>{childProfile.dietaryPreferences.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Allergies</span>
              <span>{childProfile.allergies.join(", ")}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Icon size={20} className="text-gray-400" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </section>

      <BottomNav />
    </div>
  );
} 