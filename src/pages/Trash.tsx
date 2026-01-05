import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

type DeletedRelease = {
  id: string;
  title: string;
  artist: string;
  deletedDate: string;
};

const Trash = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [releases, setReleases] = useState<DeletedRelease[]>([
    { id: "1", title: "Old Track", artist: "Artist", deletedDate: "2024-01-10" },
  ]);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleRestore = (id: string) => {
    setReleases(releases.filter((r) => r.id !== id));
    toast.success("Релиз восстановлен");
  };

  const handleDeletePermanently = (id: string) => {
    setReleases(releases.filter((r) => r.id !== id));
    toast.success("Релиз удалён навсегда");
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
        <h1 className="text-4xl font-bold mb-8">Корзина</h1>

        {releases.length > 0 ? (
          <div className="space-y-4">
            {releases.map((release) => (
              <div key={release.id} className="glass p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{release.title}</h3>
                  <p className="text-muted-foreground">{release.artist}</p>
                  <p className="text-sm text-muted-foreground">Удалено: {release.deletedDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleRestore(release.id)}>
                    <Icon name="RotateCcw" size={20} />
                    Восстановить
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeletePermanently(release.id)}
                  >
                    <Icon name="Trash2" size={20} />
                    Удалить навсегда
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-12 rounded-2xl text-center">
            <Icon name="Trash2" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h3 className="text-2xl font-bold mb-2">Корзина пуста</h3>
            <p className="text-muted-foreground">Удалённые релизы появятся здесь</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Trash;
