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

  const balance = 1250.50;
  const transactions = [
    { id: "1", type: "income", amount: 500, date: "2024-01-15", desc: "Выплата за стримы" },
    { id: "2", type: "expense", amount: 100, date: "2024-01-10", desc: "Комиссия платформы" },
    { id: "3", type: "income", amount: 850.50, date: "2024-01-05", desc: "Выплата за стримы" },
  ];

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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Кошелёк</h1>

        <div className="glass p-8 rounded-2xl mb-8 gradient-bg">
          <p className="text-white/80 mb-2">Ваш баланс</p>
          <h2 className="text-5xl font-bold text-white mb-6">{balance.toFixed(2)} ₽</h2>
          <Button variant="secondary" size="lg">
            <Icon name="CreditCard" size={20} />
            Вывести средства
          </Button>
        </div>

        <div className="glass p-8 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6">История транзакций</h3>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center glass p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      tx.type === "income" ? "bg-green-500/20" : "bg-red-500/20"
                    }`}
                  >
                    <Icon
                      name={tx.type === "income" ? "ArrowDownLeft" : "ArrowUpRight"}
                      className={tx.type === "income" ? "text-green-500" : "text-red-500"}
                      size={24}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{tx.desc}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span
                  className={`font-bold text-xl ${
                    tx.type === "income" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}{tx.amount} ₽
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wallet;
