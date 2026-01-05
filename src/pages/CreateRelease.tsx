import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/App";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { storage, Track, Release } from "@/lib/storage";

const CreateRelease = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const existingRelease = (location.state as { release?: Release })?.release;

  const [albumTitle, setAlbumTitle] = useState(existingRelease?.albumTitle || "");
  const [albumArtists, setAlbumArtists] = useState<string[]>(existingRelease?.albumArtists || [""]);
  const [wasReleased, setWasReleased] = useState<"yes" | "no">(existingRelease?.wasReleased || "no");
  const [upc, setUpc] = useState(existingRelease?.upc || "");
  const [oldReleaseDate, setOldReleaseDate] = useState(existingRelease?.oldReleaseDate || "");
  const [cover, setCover] = useState<string | null>(existingRelease?.cover || null);
  const [genre, setGenre] = useState(existingRelease?.genre || "Other");
  const [tracks, setTracks] = useState<Track[]>(
    existingRelease?.tracks || [
      {
        id: "1",
        name: "",
        artists: [""],
        isrc: "",
        version: "",
        musicians: [""],
        lyricists: [""],
        tiktokMoment: "",
        explicitLyrics: false,
        hasLyrics: true,
        language: "",
        lyrics: "",
      },
    ]
  );

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addArtist = () => setAlbumArtists([...albumArtists, ""]);
  const updateArtist = (index: number, value: string) => {
    const updated = [...albumArtists];
    updated[index] = value;
    setAlbumArtists(updated);
  };

  const addTrack = () => {
    setTracks([
      ...tracks,
      {
        id: Date.now().toString(),
        name: "",
        artists: [""],
        isrc: "",
        version: "",
        musicians: [""],
        lyricists: [""],
        tiktokMoment: "",
        explicitLyrics: false,
        hasLyrics: true,
        language: "",
        lyrics: "",
      },
    ]);
  };

  const updateTrack = (id: string, field: keyof Track, value: any) => {
    setTracks(tracks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSubmit = (status: "draft" | "moderation") => {
    if (!albumTitle.trim()) {
      toast.error("Введите название альбома");
      return;
    }

    const release: Release = {
      id: existingRelease?.id || Date.now().toString(),
      userId: user.id,
      albumTitle,
      albumArtists: albumArtists.filter((a) => a.trim()),
      wasReleased,
      upc,
      oldReleaseDate,
      cover: cover || undefined,
      status,
      genre,
      tracks,
      createdAt: existingRelease?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (existingRelease) {
      storage.updateRelease(existingRelease.id, release);
      toast.success("Релиз обновлён");
    } else {
      storage.saveRelease(release);
      toast.success(status === "draft" ? "Релиз сохранён в черновики" : "Релиз отправлен на модерацию");
    }

    navigate("/releases");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/releases")}>
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
            <AvatarFallback className="gradient-bg text-white">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">{existingRelease ? "Редактировать релиз" : "Создать релиз"}</h1>

        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12 overflow-x-auto pb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
                  step >= s ? "gradient-bg text-white" : "glass"
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`w-12 md:w-16 h-1 ${step > s ? "bg-primary" : "bg-muted"}`}></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="glass p-6 md:p-8 rounded-2xl space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">Информация об альбоме</h2>

            <div className="space-y-2">
              <Label>Название альбома</Label>
              <Input value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} placeholder="Мой альбом" className="glass" />
            </div>

            <div className="space-y-2">
              <Label>Артисты альбома</Label>
              {albumArtists.map((artist, idx) => (
                <Input key={idx} value={artist} onChange={(e) => updateArtist(idx, e.target.value)} placeholder="Имя артиста" className="glass" />
              ))}
              <Button variant="outline" onClick={addArtist} size="sm">
                <Icon name="Plus" size={16} />
                Добавить артиста
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Жанр</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                  <SelectItem value="Other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Был ли релиз выпущен ранее?</Label>
              <RadioGroup value={wasReleased} onValueChange={(v: any) => setWasReleased(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">Нет</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Да</Label>
                </div>
              </RadioGroup>
            </div>

            {wasReleased === "yes" && (
              <>
                <div className="space-y-2">
                  <Label>UPC</Label>
                  <Input value={upc} onChange={(e) => setUpc(e.target.value)} className="glass" />
                </div>
                <div className="space-y-2">
                  <Label>Старая дата релиза</Label>
                  <Input type="date" value={oldReleaseDate} onChange={(e) => setOldReleaseDate(e.target.value)} className="glass" />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Обложка (3000×3000)</Label>
              <Input type="file" accept="image/*" onChange={handleCoverChange} className="glass" />
              {cover && (
                <div className="mt-4">
                  <img src={cover} alt="Cover" className="w-32 h-32 md:w-48 md:h-48 rounded-xl object-cover" />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => handleSubmit("draft")} variant="outline" className="flex-1">
                Сохранить черновик
              </Button>
              <Button onClick={() => setStep(2)} className="gradient-bg border-0 flex-1">
                Далее
                <Icon name="ArrowRight" size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="glass p-6 md:p-8 rounded-2xl space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">Треклист</h2>

            {tracks.map((track, idx) => (
              <div key={track.id} className="glass p-4 md:p-6 rounded-xl space-y-4">
                <h3 className="font-bold text-base md:text-lg">Трек {idx + 1}</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input value={track.name} onChange={(e) => updateTrack(track.id, "name", e.target.value)} className="glass" />
                  </div>
                  <div className="space-y-2">
                    <Label>ISRC</Label>
                    <Input value={track.isrc} onChange={(e) => updateTrack(track.id, "isrc", e.target.value)} className="glass" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Версия трека</Label>
                  <Select value={track.version} onValueChange={(v) => updateTrack(track.id, "version", v)}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Выберите версию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original</SelectItem>
                      <SelectItem value="cover">Cover</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                      <SelectItem value="clean">Clean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Есть ли в треке слова?</Label>
                  <RadioGroup value={track.hasLyrics ? "yes" : "no"} onValueChange={(v) => updateTrack(track.id, "hasLyrics", v === "yes")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`lyrics-yes-${track.id}`} />
                      <Label htmlFor={`lyrics-yes-${track.id}`}>Да</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`lyrics-no-${track.id}`} />
                      <Label htmlFor={`lyrics-no-${track.id}`}>Нет</Label>
                    </div>
                  </RadioGroup>
                </div>

                {track.hasLyrics && (
                  <>
                    <div className="space-y-2">
                      <Label>Язык песни</Label>
                      <Input value={track.language || ""} onChange={(e) => updateTrack(track.id, "language", e.target.value)} className="glass" />
                    </div>
                    <div className="space-y-2">
                      <Label>Текст песни</Label>
                      <Textarea value={track.lyrics || ""} onChange={(e) => updateTrack(track.id, "lyrics", e.target.value)} className="glass" rows={4} />
                    </div>
                  </>
                )}
              </div>
            ))}

            <Button variant="outline" onClick={addTrack}>
              <Icon name="Plus" size={20} />
              Добавить трек
            </Button>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                <Icon name="ArrowLeft" size={20} />
                Назад
              </Button>
              <Button onClick={() => handleSubmit("draft")} variant="outline" className="flex-1">
                Сохранить черновик
              </Button>
              <Button onClick={() => setStep(3)} className="gradient-bg border-0 flex-1">
                Далее
                <Icon name="ArrowRight" size={20} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="glass p-6 md:p-8 rounded-2xl space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">Предпросмотр</h2>

            {cover && (
              <div className="flex justify-center mb-6">
                <img src={cover} alt="Cover" className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-2xl object-cover" />
              </div>
            )}

            <div className="space-y-4">
              <div className="glass p-4 rounded-xl">
                <h3 className="font-semibold text-base md:text-lg mb-2">Информация об альбоме</h3>
                <p className="text-sm md:text-base">
                  <strong>Название:</strong> {albumTitle}
                </p>
                <p className="text-sm md:text-base">
                  <strong>Артисты:</strong> {albumArtists.filter((a) => a.trim()).join(", ")}
                </p>
                <p className="text-sm md:text-base">
                  <strong>Жанр:</strong> {genre}
                </p>
                {wasReleased === "yes" && (
                  <>
                    <p className="text-sm md:text-base">
                      <strong>UPC:</strong> {upc}
                    </p>
                    <p className="text-sm md:text-base">
                      <strong>Дата старого релиза:</strong> {oldReleaseDate}
                    </p>
                  </>
                )}
              </div>

              <div className="glass p-4 rounded-xl">
                <h3 className="font-semibold text-base md:text-lg mb-2">Треклист ({tracks.length} треков)</h3>
                {tracks.map((track, idx) => (
                  <div key={track.id} className="glass p-3 md:p-4 rounded-xl mb-2">
                    <p className="font-semibold text-sm md:text-base">
                      {idx + 1}. {track.name || "Без названия"}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">ISRC: {track.isrc || "Не указан"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                <Icon name="ArrowLeft" size={20} />
                Назад
              </Button>
              <Button onClick={() => handleSubmit("draft")} variant="outline" className="flex-1">
                Сохранить черновик
              </Button>
              <Button onClick={() => handleSubmit("moderation")} className="gradient-bg border-0 flex-1">
                <Icon name="Send" size={20} />
                Отправить на модерацию
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateRelease;
