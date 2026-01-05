import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const menuItems = [
    { icon: "Music2", label: "Релизы", path: "/releases" },
    { icon: "MessageSquare", label: "Тикеты", path: "/tickets" },
    { icon: "Trash2", label: "Корзина", path: "/trash" },
    { icon: "Wallet", label: "Кошелёк", path: "/wallet" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="glass w-80">
                <div className="py-6">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                      <Icon name="Music" className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold gradient-text">Kedoo</span>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition"
                      >
                        <Icon name={item.icon} size={20} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Icon name="Music" className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">Kedoo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
            >
              <Icon name="Settings" size={20} />
            </Button>
            <Avatar className="cursor-pointer" onClick={() => navigate("/settings")}>
              <AvatarFallback className="gradient-bg text-white">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Привет, {user.username}! 👋</h1>
          <p className="text-muted-foreground">Управляй своими релизами и тикетами</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="glass p-6 rounded-2xl hover:scale-105 transition cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-4">
                <Icon name={item.icon} className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold">{item.label}</h3>
            </div>
          ))}
        </div>

        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Быстрый старт</h2>
          <p className="text-muted-foreground mb-6">
            Начни свой путь в музыкальной индустрии с создания первого релиза
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/releases/create")}
            className="gradient-bg border-0"
          >
            <Icon name="Plus" size={20} />
            Создать релиз
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
