import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: "open" | "closed";
  date: string;
  response?: string;
};

const mockTickets: Ticket[] = [
  {
    id: "1",
    subject: "Вопрос по модерации",
    message: "Почему мой релиз отклонён?",
    status: "open",
    date: "2024-01-10",
  },
  {
    id: "2",
    subject: "Техническая поддержка",
    message: "Не могу загрузить обложку",
    status: "closed",
    date: "2024-01-08",
    response: "Проблема решена. Попробуйте ещё раз.",
  },
];

const Tickets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleCreateTicket = () => {
    if (!newSubject || !newMessage) {
      toast.error("Заполните все поля");
      return;
    }

    const newTicket: Ticket = {
      id: Date.now().toString(),
      subject: newSubject,
      message: newMessage,
      status: "open",
      date: new Date().toISOString().split("T")[0],
    };

    setTickets([newTicket, ...tickets]);
    setNewSubject("");
    setNewMessage("");
    setDialogOpen(false);
    toast.success("Тикет создан");
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

          <Avatar className="cursor-pointer" onClick={() => navigate("/settings")}>
            <AvatarFallback className="gradient-bg text-white">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Тикеты</h1>
            <p className="text-muted-foreground">Общайтесь с модераторами</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gradient-bg border-0">
                <Icon name="Plus" size={20} />
                Создать тикет
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle className="gradient-text">Новый тикет</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Тема тикета</Label>
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Вопрос по релизу"
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Сообщение</Label>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Опишите ваш вопрос..."
                    className="glass"
                    rows={5}
                  />
                </div>
                <Button onClick={handleCreateTicket} className="w-full gradient-bg border-0">
                  Отправить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground">{ticket.date}</p>
                </div>
                <Badge className={ticket.status === "open" ? "bg-primary" : "bg-muted"}>
                  {ticket.status === "open" ? "Открыт" : "Закрыт"}
                </Badge>
              </div>

              <div className="glass p-4 rounded-xl mb-4">
                <p className="text-foreground/80">{ticket.message}</p>
              </div>

              {ticket.response && (
                <div className="glass p-4 rounded-xl bg-primary/10">
                  <p className="text-sm font-semibold mb-2">Ответ модератора:</p>
                  <p className="text-foreground/80">{ticket.response}</p>
                </div>
              )}
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="glass p-12 rounded-2xl text-center">
              <Icon name="MessageSquare" className="mx-auto mb-4 text-muted-foreground" size={64} />
              <h3 className="text-2xl font-bold mb-2">Нет тикетов</h3>
              <p className="text-muted-foreground">Создайте тикет для связи с модератором</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tickets;
