import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Icon name="Music" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold gradient-text">Kedoo</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground/80 hover:text-foreground transition">
              Главная
            </a>
            <a href="#about" className="text-foreground/80 hover:text-foreground transition">
              О сервисе
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-foreground transition">
              Контакты
            </a>
          </div>

          <Button onClick={() => navigate("/auth")} className="gradient-bg border-0">
            Войти
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block animate-float mb-8">
            <div className="w-24 h-24 rounded-3xl gradient-bg flex items-center justify-center shadow-2xl">
              <Icon name="Disc3" className="text-white" size={48} />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            Распространяй свою музыку
            <br />
            по всему миру
          </h1>

          <p className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto">
            Kedoo — платформа для дистрибуции музыки. Загружай треки и отправляй их на популярные
            стриминговые сервисы: Spotify, Apple Music, YouTube Music и многие другие.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="gradient-bg border-0 text-lg px-8 py-6"
            >
              Зарегистрироваться
              <Icon name="ArrowRight" size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass text-lg px-8 py-6"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            >
              Узнать больше
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="glass p-8 rounded-2xl hover:scale-105 transition">
              <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center mb-4 mx-auto">
                <Icon name="Upload" className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Загрузи треки</h3>
              <p className="text-foreground/70">Простая форма для добавления релизов с обложками и метаданными</p>
            </div>

            <div className="glass p-8 rounded-2xl hover:scale-105 transition">
              <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center mb-4 mx-auto">
                <Icon name="Globe" className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Распространяй</h3>
              <p className="text-foreground/70">Твоя музыка появится на всех популярных стриминговых платформах</p>
            </div>

            <div className="glass p-8 rounded-2xl hover:scale-105 transition">
              <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center mb-4 mx-auto">
                <Icon name="TrendingUp" className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Развивайся</h3>
              <p className="text-foreground/70">Управляй релизами и общайся с модераторами через тикеты</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass p-12 rounded-3xl">
            <h2 className="text-4xl font-bold mb-6 gradient-text text-center">О сервисе</h2>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              Kedoo — это современная платформа для музыкальной дистрибуции, созданная для артистов,
              которые хотят донести свою музыку до миллионов слушателей.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Мы предлагаем простой процесс загрузки релизов, модерацию качества, управление треклистами
              и поддержку через систему тикетов. Ваша музыка заслуживает того, чтобы её услышали.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6 gradient-text">Контакты</h2>
          <p className="text-lg text-foreground/70 mb-8">
            По всем вопросам пишите на почту:
          </p>
          <a
            href="mailto:olprodlabel@gmail.com"
            className="inline-flex items-center gap-2 text-2xl font-semibold text-primary hover:text-secondary transition"
          >
            <Icon name="Mail" size={28} />
            olprodlabel@gmail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-foreground/60">
          <p>© 2024 Kedoo. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
