import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const themes = [
  { id: "default", name: "Пурпурный", gradient: "from-purple-500 via-pink-500 to-orange-500" },
  { id: "ocean", name: "Океан", gradient: "from-blue-500 via-cyan-500 to-teal-500" },
  { id: "sunset", name: "Закат", gradient: "from-red-500 via-orange-500 to-pink-500" },
  { id: "forest", name: "Лес", gradient: "from-green-500 via-emerald-500 to-lime-500" },
  { id: "midnight", name: "Полночь", gradient: "from-blue-600 via-indigo-600 to-purple-600" },
  { id: "candy", name: "Конфета", gradient: "from-pink-500 via-purple-500 to-fuchsia-500" },
  { id: "neon", name: "Неон", gradient: "from-green-400 via-purple-500 to-yellow-400" },
  { id: "lavender", name: "Лаванда", gradient: "from-purple-400 via-violet-400 to-fuchsia-400" },
  { id: "fire", name: "Огонь", gradient: "from-orange-600 via-red-500 to-yellow-500" },
  { id: "emerald", name: "Изумруд", gradient: "from-emerald-500 via-teal-500 to-green-500" },
  { id: "royal", name: "Королевский", gradient: "from-indigo-600 via-purple-600 to-yellow-500" },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, theme, setTheme } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSaveProfile = () => {
    toast.success("Профиль обновлён");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Вы вышли из аккаунта");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Icon name="Music" className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">Kedoo</span>
            </div>
          </div>

          <Avatar>
            <AvatarFallback className="gradient-bg text-white">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Настройки</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="theme">Тема</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="glass p-8 rounded-2xl space-y-6">
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="gradient-bg text-white text-3xl">
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Новый пароль</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Оставьте пустым, чтобы не менять"
                    className="glass"
                  />
                </div>

                <Button onClick={handleSaveProfile} className="gradient-bg border-0">
                  <Icon name="Save" size={20} />
                  Сохранить изменения
                </Button>
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <Button variant="destructive" onClick={handleLogout}>
                  <Icon name="LogOut" size={20} />
                  Выйти из аккаунта
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme">
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Выбрать тему оформления</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`cursor-pointer glass p-4 rounded-xl hover:scale-105 transition ${
                      theme === t.id ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className={`w-full h-24 rounded-lg bg-gradient-to-r ${t.gradient} mb-3`}></div>
                    <p className="font-semibold text-center">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
