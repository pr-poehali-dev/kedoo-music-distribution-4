import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Release = {
  id: string;
  title: string;
  artist: string;
  status: "draft" | "moderation" | "approved" | "rejected";
  genre: string;
  cover?: string;
};

const mockReleases: Release[] = [
  { id: "1", title: "Summer Vibes", artist: "Artist Name", status: "draft", genre: "Pop" },
  { id: "2", title: "Night Dreams", artist: "Artist Name", status: "moderation", genre: "Electronic" },
  { id: "3", title: "Rock On", artist: "Artist Name", status: "approved", genre: "Rock" },
];

const Releases = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [releases] = useState<Release[]>(mockReleases);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");

  if (!user) {
    navigate("/auth");
    return null;
  }

  const getStatusBadge = (status: Release["status"]) => {
    const variants = {
      draft: { label: "Черновик", className: "bg-muted" },
      moderation: { label: "На модерации", className: "bg-primary" },
      approved: { label: "Одобрен", className: "bg-green-500" },
      rejected: { label: "Отклонён", className: "bg-destructive" },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const filteredReleases = releases.filter((release) => {
    if (statusFilter !== "all" && release.status !== statusFilter) return false;
    if (genreFilter !== "all" && release.genre !== genreFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
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

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Релизы</h1>
            <p className="text-muted-foreground">Управляй своими треками</p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate("/releases/create")}
            className="gradient-bg border-0"
          >
            <Icon name="Plus" size={20} />
            Создать релиз
          </Button>
        </div>

        {/* Filters */}
        <div className="glass p-6 rounded-2xl mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">Статус</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="moderation">На модерации</SelectItem>
                  <SelectItem value="approved">Одобрен</SelectItem>
                  <SelectItem value="rejected">Отклонён</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">Жанр</label>
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все жанры</SelectItem>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Releases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReleases.map((release) => (
            <div key={release.id} className="glass p-6 rounded-2xl hover:scale-105 transition">
              <div className="w-full aspect-square bg-gradient-to-br from-primary via-secondary to-accent rounded-xl mb-4 flex items-center justify-center">
                <Icon name="Disc3" className="text-white" size={64} />
              </div>
              <h3 className="text-xl font-bold mb-1">{release.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{release.artist}</p>
              <div className="flex items-center justify-between mb-4">
                {getStatusBadge(release.status)}
                <span className="text-sm text-muted-foreground">{release.genre}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Eye" size={16} />
                  Просмотр
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Edit" size={16} />
                  Редактировать
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredReleases.length === 0 && (
          <div className="glass p-12 rounded-2xl text-center">
            <Icon name="Music2" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h3 className="text-2xl font-bold mb-2">Релизы не найдены</h3>
            <p className="text-muted-foreground mb-6">Попробуйте изменить фильтры или создайте новый релиз</p>
            <Button onClick={() => navigate("/releases/create")} className="gradient-bg border-0">
              <Icon name="Plus" size={20} />
              Создать релиз
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Releases;
