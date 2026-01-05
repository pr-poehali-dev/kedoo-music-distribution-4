import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/auth");
    return null;
  }

  const balance = 0;

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

          <Avatar className="cursor-pointer" onClick={() => navigate("/settings")}>
            <AvatarFallback className="gradient-bg text-white">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Кошелёк</h1>

        <div className="glass p-6 md:p-8 rounded-2xl mb-6 md:mb-8 gradient-bg">
          <p className="text-white/80 mb-2 text-sm md:text-base">Ваш баланс</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">{balance.toFixed(2)} ₽</h2>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            <Icon name="CreditCard" size={20} />
            Вывести средства
          </Button>
        </div>

        <div className="glass p-6 md:p-8 rounded-2xl">
          <h3 className="text-xl md:text-2xl font-bold mb-6">История транзакций</h3>
          <div className="text-center py-8 md:py-12">
            <Icon name="Wallet" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <p className="text-muted-foreground text-sm md:text-base">Транзакций пока нет</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wallet;