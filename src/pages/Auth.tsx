import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { toast } from "sonner";
import { storage } from "@/lib/storage";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "login") {
      const user = storage.findUser(email, password);
      if (user) {
        setUser({ id: user.id, email: user.email, username: user.username });
        toast.success("Вход выполнен успешно!");
        navigate("/dashboard");
      } else {
        toast.error("Неверный email или пароль");
      }
    } else if (mode === "register") {
      const existingUsers = storage.getUsers();
      if (existingUsers.find((u) => u.email === email)) {
        toast.error("Пользователь с таким email уже существует");
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        email,
        username,
        password,
      };
      storage.saveUser(newUser);
      setUser({ id: newUser.id, email: newUser.email, username: newUser.username });
      toast.success("Регистрация успешна!");
      navigate("/dashboard");
    } else {
      const users = storage.getUsers();
      const user = users.find((u) => u.email === email);
      if (user && newPassword) {
        storage.updateUser(user.id, { password: newPassword });
        toast.success("Пароль успешно изменён");
        setMode("login");
      } else {
        toast.error("Пользователь не найден");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <Card className="w-full max-w-md glass p-8 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center">
            <Icon name="Music" className="text-white" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 gradient-text">
          {mode === "login" ? "Вход" : mode === "register" ? "Регистрация" : "Сброс пароля"}
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          {mode === "login" ? "Войдите в свой аккаунт" : mode === "register" ? "Создайте новый аккаунт" : "Введите email для сброса пароля"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass"
            />
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="glass"
              />
            </div>
          )}

          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="glass pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
                </button>
              </div>
            </div>
          )}

          {mode === "reset" && (
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="glass"
              />
            </div>
          )}

          {mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("reset")}
              className="text-sm text-primary hover:text-secondary transition"
            >
              Забыли пароль?
            </button>
          )}

          <Button type="submit" className="w-full gradient-bg border-0">
            {mode === "login" ? "Войти" : mode === "register" ? "Зарегистрироваться" : "Сбросить пароль"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          {mode === "login" ? (
            <p className="text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <button onClick={() => setMode("register")} className="text-primary hover:text-secondary transition">
                Зарегистрироваться
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <button onClick={() => setMode("login")} className="text-primary hover:text-secondary transition">
                Войти
              </button>
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="w-full mt-4"
        >
          <Icon name="ArrowLeft" size={20} />
          На главную
        </Button>
      </Card>
    </div>
  );
};

export default Auth;