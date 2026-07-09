<template>
  <div class="bio-container">
    <div class="bio-content">
      <header class="bio-header">
        <div class="avatar">
          <div class="avatar-inner">DI</div>
        </div>
        <div class="header-text">
          <h1 class="bio-title">Data Impetus</h1>
          <p class="bio-subtitle">Inteligência Artificial & Ecossistemas</p>
        </div>
      </header>

      <div class="links-grid">
        <!-- Mentoria -->
        <a href="https://wa.me/5561991256418" target="_blank" rel="noopener noreferrer" class="link-card">
          <div class="card-top">
            <div class="glow"></div>
            <h2 class="card-title">Mentoria</h2>
          </div>
          <div class="card-bottom">
            <p class="card-action">Agendar via WhatsApp</p>
          </div>
        </a>

        <!-- Serviços de ecossistema de IA comercial -->
        <a href="https://wa.me/5561991256418" target="_blank" rel="noopener noreferrer" class="link-card">
          <div class="card-top">
            <div class="glow"></div>
            <h2 class="card-title">Serviços de Ecossistema de IA Comercial</h2>
          </div>
          <div class="card-bottom">
            <p class="card-action">Consultar via WhatsApp</p>
          </div>
        </a>

        <!-- YouTube -->
        <a href="https://www.youtube.com/@DataImpetusIA/videos" target="_blank" rel="noopener noreferrer" class="link-card">
          <div class="card-top">
            <div class="glow"></div>
            <h2 class="card-title">YouTube</h2>
          </div>
          <div class="card-bottom">
            <p class="card-action">Acessar o Canal</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false, // Uma página pública de bio geralmente não tem o layout principal do sistema
  auth: false // Tornar acessível sem login
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

.bio-container {
  min-height: 100vh;
  background-color: #09090b;
  color: #fafafa;
  font-family: 'Outfit', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1.5rem;
  background-image: 
    radial-gradient(circle at 15% 0%, rgba(255, 107, 0, 0.05), transparent 30%),
    radial-gradient(circle at 85% 100%, rgba(255, 107, 0, 0.05), transparent 30%);
}

.bio-content {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

.bio-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #27272a, #18181b);
  border: 2px solid #ff6b00;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(255, 107, 0, 0.25);
}

.avatar-inner {
  width: 100%;
  height: 100%;
  background-color: #09090b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: #ff6b00;
  letter-spacing: 1px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bio-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.bio-subtitle {
  font-size: 0.95rem;
  color: #a1a1aa;
  margin: 0;
  font-weight: 400;
}

.links-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.link-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background-color: #121214;
  border: 1px solid #27272a;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.link-card:hover {
  transform: translateY(-4px);
  border-color: #ff6b00;
  box-shadow: 0 16px 40px -12px rgba(255, 107, 0, 0.3);
}

.card-top {
  padding: 3rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #18181b 0%, #121214 100%);
  position: relative;
  min-height: 120px;
  overflow: hidden;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 500;
  color: #ffffff;
  margin: 0;
  text-align: center;
  z-index: 2;
  transition: transform 0.4s ease;
}

.link-card:hover .card-title {
  transform: scale(1.05);
}

.card-bottom {
  padding: 1.25rem;
  background-color: #09090b;
  border-top: 1px solid #27272a;
  text-align: center;
  transition: all 0.4s ease;
}

.card-action {
  font-size: 0.95rem;
  font-weight: 500;
  color: #a1a1aa;
  margin: 0;
  transition: color 0.3s ease;
}

.link-card:hover .card-bottom {
  background-color: #121214;
  border-top-color: #ff6b00;
}

.link-card:hover .card-action {
  color: #ff6b00;
}

.glow {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 107, 0, 0.1) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.link-card:hover .glow {
  opacity: 1;
}

@media (max-width: 480px) {
  .card-title {
    font-size: 1.15rem;
  }
}
</style>
