import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Track = {
  id: string;
  name: string;
  artists: string[];
  file?: File;
  isrc: string;
  version: string;
  musicians: string[];
  lyricists: string[];
  tiktokMoment: string;
  explicitLyrics: boolean;
  hasLyrics: boolean;
  language?: string;
  lyrics?: string;
};

const CreateRelease = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  // Album info
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumArtists, setAlbumArtists] = useState([""]);
  const [wasReleased, setWasReleased] = useState<"yes" | "no">("no");
  const [upc, setUpc] = useState("");
  const [oldReleaseDate, setOldReleaseDate] = useState("");
  const [cover, setCover] = useState<File | null>(null);

  // Tracklist
  const [tracks, setTracks] = useState<Track[]>([
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
  ]);

  if (!user) {
    navigate("/auth");
    return null;
  }

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

  const updateTrack = (id: string, field: string, value: any) => {
    setTracks(tracks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSubmit = () => {
    toast.success("Релиз отправлен на модерацию!");
    navigate("/releases");
  };

  const handleSaveDraft = () => {
    toast.success("Релиз сохранён в черновики");
    navigate("/releases");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <AvatarFallback className="gradient-bg text-white">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Создать релиз</h1>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? "gradient-bg text-white" : "glass"
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`w-16 h-1 ${step > s ? "bg-primary" : "bg-muted"}`}></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Album Info */}
        {step === 1 && (
          <div className="glass p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold">Информация об альбоме</h2>

            <div className="space-y-2">
              <Label>Название альбома</Label>
              <Input
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="Мой альбом"
                className="glass"
              />
            </div>

            <div className="space-y-2">
              <Label>Артисты альбома</Label>
              {albumArtists.map((artist, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={artist}
                    onChange={(e) => updateArtist(idx, e.target.value)}
                    placeholder="Имя артиста"
                    className="glass"
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addArtist} size="sm">
                <Icon name="Plus" size={16} />
                Добавить артиста
              </Button>
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
                  <Input
                    type="date"
                    value={oldReleaseDate}
                    onChange={(e) => setOldReleaseDate(e.target.value)}
                    className="glass"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Обложка (3000×3000)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
                className="glass"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
                Сохранить черновик
              </Button>
              <Button onClick={() => setStep(2)} className="gradient-bg border-0 flex-1">
                Далее
                <Icon name="ArrowRight" size={20} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Tracklist */}
        {step === 2 && (
          <div className="glass p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold">Треклист</h2>

            {tracks.map((track, idx) => (
              <div key={track.id} className="glass p-6 rounded-xl space-y-4">
                <h3 className="font-bold text-lg">Трек {idx + 1}</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input
                      value={track.name}
                      onChange={(e) => updateTrack(track.id, "name", e.target.value)}
                      className="glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ISRC</Label>
                    <Input
                      value={track.isrc}
                      onChange={(e) => updateTrack(track.id, "isrc", e.target.value)}
                      className="glass"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Файл трека (.wav)</Label>
                  <Input
                    type="file"
                    accept=".wav"
                    onChange={(e) => updateTrack(track.id, "file", e.target.files?.[0])}
                    className="glass"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Версия трека</Label>
                  <Select
                    value={track.version}
                    onValueChange={(v) => updateTrack(track.id, "version", v)}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Выберите версию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original</SelectItem>
                      <SelectItem value="cover">Cover</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                      <SelectItem value="clean">Clean</SelectItem>
                      <SelectItem value="speed_up">Speed Up</SelectItem>
                      <SelectItem value="slowed">Slowed</SelectItem>
                      <SelectItem value="extended">Extended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Момент TikTok (00:00)</Label>
                  <Input
                    value={track.tiktokMoment}
                    onChange={(e) => updateTrack(track.id, "tiktokMoment", e.target.value)}
                    placeholder="00:00"
                    className="glass"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Есть ли в треке слова?</Label>
                  <RadioGroup
                    value={track.hasLyrics ? "yes" : "no"}
                    onValueChange={(v) => updateTrack(track.id, "hasLyrics", v === "yes")}
                  >
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
                      <Input
                        value={track.language || ""}
                        onChange={(e) => updateTrack(track.id, "language", e.target.value)}
                        className="glass"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Текст песни</Label>
                      <Textarea
                        value={track.lyrics || ""}
                        onChange={(e) => updateTrack(track.id, "lyrics", e.target.value)}
                        className="glass"
                        rows={6}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            <Button variant="outline" onClick={addTrack}>
              <Icon name="Plus" size={20} />
              Добавить трек
            </Button>

            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                <Icon name="ArrowLeft" size={20} />
                Назад
              </Button>
              <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
                Сохранить черновик
              </Button>
              <Button onClick={() => setStep(3)} className="gradient-bg border-0 flex-1">
                Далее
                <Icon name="ArrowRight" size={20} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="glass p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold">Предпросмотр</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Информация об альбоме</h3>
                <p><strong>Название:</strong> {albumTitle}</p>
                <p><strong>Артисты:</strong> {albumArtists.join(", ")}</p>
                {wasReleased === "yes" && (
                  <>
                    <p><strong>UPC:</strong> {upc}</p>
                    <p><strong>Дата старого релиза:</strong> {oldReleaseDate}</p>
                  </>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Треклист ({tracks.length} треков)</h3>
                {tracks.map((track, idx) => (
                  <div key={track.id} className="glass p-4 rounded-xl mb-2">
                    <p className="font-semibold">{idx + 1}. {track.name || "Без названия"}</p>
                    <p className="text-sm text-muted-foreground">ISRC: {track.isrc || "Не указан"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                <Icon name="ArrowLeft" size={20} />
                Назад
              </Button>
              <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
                Сохранить черновик
              </Button>
              <Button onClick={handleSubmit} className="gradient-bg border-0 flex-1">
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
