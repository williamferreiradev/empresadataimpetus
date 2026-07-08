<template>
  <div :class="[themeClasses, 'w-full min-h-full font-sans transition-all duration-300 relative pb-0']" :style="customVars">
    
    <!-- HEADER -->
    <header class="flex justify-between items-center px-10 md:px-20 py-6 border-b" :class="[isDark ? 'border-white/5' : 'border-black/5']">
      <div class="flex items-center gap-4">
        <div v-if="content.logoUrl" class="h-12 w-12 rounded overflow-hidden flex items-center justify-center">
          <img :src="content.logoUrl" alt="Logo" class="max-h-full max-w-full object-contain" />
        </div>
        <div v-else class="w-12 h-12 rounded flex items-center justify-center font-black text-2xl text-theme-inverted bg-theme-primary">
          {{ content.nomeEmpresa ? content.nomeEmpresa.charAt(0).toUpperCase() : niche.fallbackNome.charAt(0) }}
        </div>
        <div>
          <h2 class="font-bold text-xl leading-none text-theme-primary tracking-tight font-serif">
            {{ content.nomeEmpresa || niche.fallbackNome }}
          </h2>
          <p class="text-[10px] tracking-widest uppercase mt-1" :class="isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-500 dark:text-zinc-400'">{{ niche.fallbackNome }}</p>
        </div>
      </div>
      <nav class="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase" :class="[isDark ? 'text-gray-300' : 'text-gray-600 dark:text-zinc-400']">
        <a href="#" class="text-theme-primary border-b-2 pb-1" :style="{ borderColor: theme.cor }">Home</a>
        <a href="#" class="hover:text-theme-primary transition-colors">Portfolio</a>
        <a href="#" class="hover:text-theme-primary transition-colors">Sobre</a>
        <a href="#" class="hover:text-theme-primary transition-colors">Contato</a>
      </nav>
      <button class="bg-theme-primary text-theme-inverted font-bold text-xs uppercase tracking-wider px-6 py-3 hover:opacity-90 transition-opacity">
        Reservar Agora
      </button>
    </header>

    <!-- HERO -->
    <section class="flex flex-col md:flex-row items-center px-10 md:px-20 py-20 gap-16">
      <div class="flex-1">
        <p class="text-theme-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">{{ theme.hero.tagline }}</p>
        <p class="italic mb-6 text-xl font-serif" :class="[isDark ? 'text-gray-300' : 'text-gray-600 dark:text-zinc-400']">Bem-vindo à {{ content.nomeEmpresa || niche.fallbackNome }}</p>
        
        <h1 class="text-6xl md:text-7xl font-serif font-bold leading-[1.1] mb-8 tracking-tight" :class="[isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100']">
          {{ theme.hero.headline }}<br/>
          <span class="text-theme-primary">{{ theme.hero.highlight }}.</span>
        </h1>
        
        <p class="text-lg mb-10 max-w-lg leading-relaxed" :class="[isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-600 dark:text-zinc-400']">
          {{ theme.hero.subheadline }}
        </p>
        
        <div class="flex flex-wrap gap-4 mb-16">
          <button class="bg-theme-primary text-theme-inverted font-bold px-8 py-4 text-sm uppercase tracking-wider hover:opacity-90 transition-opacity">
            Agendar Horário
          </button>
          <button class="border border-theme-primary/30 text-theme-primary font-bold px-8 py-4 text-sm uppercase tracking-wider hover:bg-theme-primary/10 transition-colors">
            Ver Portfolio
          </button>
        </div>

        <div class="grid grid-cols-3 gap-8 pt-10 border-t max-w-lg" :class="isDark ? 'border-white/10' : 'border-black/10'">
          <div>
            <p class="text-3xl font-bold text-theme-primary mb-1">{{ niche.stats.v1 }}</p>
            <p class="text-[10px] uppercase tracking-widest" :class="isDark ? 'text-gray-500 dark:text-zinc-400' : 'text-gray-400 dark:text-zinc-500'">{{ niche.stats.l1 }}</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-theme-primary mb-1">{{ niche.stats.v2 }}</p>
            <p class="text-[10px] uppercase tracking-widest" :class="isDark ? 'text-gray-500 dark:text-zinc-400' : 'text-gray-400 dark:text-zinc-500'">{{ niche.stats.l2 }}</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-theme-primary mb-1">{{ niche.stats.v3 }}</p>
            <p class="text-[10px] uppercase tracking-widest" :class="isDark ? 'text-gray-500 dark:text-zinc-400' : 'text-gray-400 dark:text-zinc-500'">{{ niche.stats.l3 }}</p>
          </div>
        </div>
      </div>
      
      <!-- HERO IMAGE -->
      <div class="flex-1 w-full relative">
        <div class="absolute inset-0 border-2 translate-x-6 translate-y-6" :style="{ borderColor: theme.cor + '40' }"></div>
        <div class="w-full h-[600px] relative z-10 overflow-hidden" :class="isDark ? 'bg-gray-900' : 'bg-gray-200'">
          <img v-if="content.heroUrl" :src="content.heroUrl" class="w-full h-full object-cover" alt="Hero" />
          <div v-else class="absolute inset-0 flex flex-col items-center justify-center opacity-50">
            <svg class="w-20 h-20 mb-4 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="font-bold tracking-widest uppercase text-xs">Sem foto principal</p>
          </div>
          <!-- Badge -->
          <div class="absolute bottom-0 right-0 bg-theme-primary text-theme-inverted p-6 w-48">
            <p class="text-3xl font-bold mb-1">15+</p>
            <p class="text-[10px] uppercase tracking-widest font-bold">Anos de Experiência</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PORTFOLIO -->
    <section class="px-10 md:px-20 py-24" :class="isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50 dark:bg-zinc-900'">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <p class="text-theme-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">Galeria Completa</p>
        <h2 class="text-5xl font-serif font-bold mb-6" :class="[isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100']">Portfolio</h2>
        <p class="text-lg leading-relaxed" :class="[isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-600 dark:text-zinc-400']">
          Cada trabalho conta uma história. Explore nossa galeria e encontre inspiração.
        </p>
      </div>

      <!-- Filters -->
      <div class="flex justify-center gap-6 mb-12 flex-wrap">
        <button v-for="(tag, i) in niche.portfolio.tags" :key="i" class="text-xs font-bold tracking-widest uppercase border-b-2 pb-1 transition-colors" :class="i === 0 ? 'text-theme-primary border-theme-primary' : (isDark ? 'text-gray-500 dark:text-zinc-400 border-transparent hover:text-theme-primary' : 'text-gray-400 dark:text-zinc-500 border-transparent hover:text-theme-primary')" :style="i === 0 ? { borderColor: theme.cor } : {}">
          {{ tag }}
        </button>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div v-for="(item, i) in niche.portfolio.items" :key="i" class="group relative aspect-[4/5] overflow-hidden bg-gray-800">
          <img :src="item.img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <p class="text-theme-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-2">{{ item.tag }}</p>
            <h3 class="text-white text-2xl font-serif font-bold">{{ item.title }}</h3>
          </div>
        </div>
      </div>

      <div class="text-center p-12 border" :class="isDark ? 'border-white/10 bg-[#050505]' : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'">
        <p class="text-xl font-serif mb-6" :class="[isDark ? 'text-gray-300' : 'text-gray-600 dark:text-zinc-400']">Gostou do que viu?</p>
        <button class="bg-theme-primary text-theme-inverted font-bold px-8 py-4 text-sm uppercase tracking-wider hover:opacity-90 transition-opacity">
          Agendar Serviço
        </button>
      </div>
    </section>

    <!-- QUEM SOU EU -->
    <section class="px-10 md:px-20 py-24 flex flex-col md:flex-row items-center gap-16">
      <div class="flex-1 w-full relative">
        <div class="absolute inset-0 border-2 -translate-x-6 -translate-y-6" :style="{ borderColor: theme.cor + '40' }"></div>
        <div class="w-full aspect-[3/4] relative z-10 overflow-hidden" :class="isDark ? 'bg-gray-800' : 'bg-gray-200'">
          <img v-if="content.sobreUrl" :src="content.sobreUrl" class="w-full h-full object-cover" alt="Quem sou eu" />
          <div v-else class="absolute inset-0 flex flex-col items-center justify-center opacity-30">
            <svg class="w-24 h-24 mb-4 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p class="font-bold tracking-widest uppercase text-xs">Sem foto sobre mim</p>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <p class="text-theme-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">{{ niche.quemSou.tag }}</p>
        <h2 class="text-5xl font-serif font-bold mb-10" :class="[isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100']">{{ niche.quemSou.title }}</h2>
        
        <div class="text-lg leading-relaxed space-y-6" :class="[isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-600 dark:text-zinc-400']">
          <p v-if="content.sobreTexto" class="whitespace-pre-line">{{ content.sobreTexto }}</p>
          <template v-else>
            <p>
              Olá, eu sou <strong>{{ content.nomeCliente || niche.quemSou.defaultName }}</strong>. Minha jornada profissional começou não apenas como um ofício, mas como uma paixão por excelência e em entregar o melhor serviço para você.
            </p>
            <p>
              Com mais de uma década de experiência, especializei-me em técnicas e soluções que unem precisão e qualidade. Para nós, o nosso trabalho é sobre detalhes, conexão e, acima de tudo, satisfação.
            </p>
            <p>
              Na {{ content.nomeEmpresa || niche.fallbackNome }}, não entregamos apenas um serviço; entregamos uma experiência premium onde você é a nossa prioridade.
            </p>
          </template>
        </div>
        
        <button class="mt-10 border border-theme-primary text-theme-primary font-bold px-8 py-4 text-sm uppercase tracking-wider hover:bg-theme-primary/10 transition-colors flex items-center gap-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Chamar no WhatsApp
        </button>
      </div>
    </section>

    <!-- PHOTO GALLERY -->
    <section class="grid grid-cols-2 md:grid-cols-4 w-full">
      <div class="aspect-square bg-gray-800 relative group overflow-hidden">
        <img :src="niche.portfolio.items[0].img" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
      </div>
      <div class="aspect-square bg-gray-900 relative group overflow-hidden">
        <img :src="niche.portfolio.items[1].img" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
      </div>
      <div class="aspect-square bg-black relative group overflow-hidden flex flex-col items-center justify-center text-center p-8">
        <div class="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-serif text-theme-primary mb-4" :style="{ borderColor: theme.cor }">
          {{ content.nomeEmpresa ? content.nomeEmpresa.charAt(0).toUpperCase() : niche.fallbackNome.charAt(0) }}
        </div>
        <p class="text-white font-serif text-xl">{{ content.nomeEmpresa || niche.fallbackNome }}</p>
        <p class="text-theme-primary text-xs tracking-[0.2em] uppercase mt-2">Qualidade Inabalável</p>
      </div>
      <div class="aspect-square bg-gray-800 relative group overflow-hidden">
        <img :src="niche.portfolio.items[2].img" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
      </div>
    </section>

    <!-- AVALIAÇÕES -->
    <section class="px-10 md:px-20 py-24" :class="isDark ? 'bg-[#050505]' : 'bg-white dark:bg-zinc-800'">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <p class="text-theme-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">{{ niche.avaliacoes.tag }}</p>
        <h2 class="text-5xl font-serif font-bold mb-6" :class="[isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100']">Avaliações</h2>
        <p class="text-lg leading-relaxed" :class="[isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-600 dark:text-zinc-400']">
          O que nossos clientes dizem sobre a experiência {{ content.nomeEmpresa || niche.fallbackNome }}. A satisfação em cada detalhe.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="(review, i) in niche.avaliacoes.items" :key="i" class="p-10 border" :class="isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700'">
          <div class="flex text-theme-primary mb-6">
            <svg v-for="s in 5" :key="s" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <p class="text-lg italic mb-8 leading-relaxed" :class="isDark ? 'text-gray-300' : 'text-gray-700 dark:text-zinc-300'">"{{ review.text }}"</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded bg-theme-primary/10 flex items-center justify-center font-serif text-xl font-bold text-theme-primary">
              {{ review.name.charAt(0) }}
            </div>
            <div>
              <p class="font-bold text-sm uppercase tracking-wider" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100'">{{ review.name }}</p>
              <p class="text-[10px] font-bold uppercase tracking-widest mt-1" :class="isDark ? 'text-gray-500 dark:text-zinc-400' : 'text-gray-400 dark:text-zinc-500'">{{ review.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTATO -->
    <section class="px-10 md:px-20 py-24 flex flex-col md:flex-row gap-16" :class="isDark ? 'bg-[#0a0a0a] border-t border-white/5' : 'bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700'">
      <div class="flex-1">
        <p class="text-theme-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">{{ niche.contatoTag }}</p>
        <h2 class="text-5xl font-serif font-bold mb-8" :class="[isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100']">Contato</h2>
        <p class="text-lg leading-relaxed mb-12" :class="[isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-600 dark:text-zinc-400']">
          Estamos localizados no coração da cidade, prontos para oferecer o melhor atendimento. Venha nos visitar ou agende pelo WhatsApp.
        </p>

        <div class="space-y-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 border rounded flex items-center justify-center text-theme-primary shrink-0" :class="isDark ? 'border-white/10' : 'border-black/10'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p class="text-xs font-bold tracking-[0.15em] uppercase mb-2" :class="isDark ? 'text-gray-500 dark:text-zinc-400' : 'text-gray-400 dark:text-zinc-500'">Nosso Endereço</p>
              <p class="text-lg font-serif" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100'">Av. Principal, 123 - Centro<br>Brasília - DF</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 border rounded flex items-center justify-center text-theme-primary shrink-0" :class="isDark ? 'border-white/10' : 'border-black/10'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-xs font-bold tracking-[0.15em] uppercase mb-2" :class="isDark ? 'text-gray-500 dark:text-zinc-400' : 'text-gray-400 dark:text-zinc-500'">Horário de Atendimento</p>
              <p class="text-lg font-serif" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100'">Ter - Sex: 09:00 - 20:00<br>Sáb: 08:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex-1">
        <div class="p-12 border h-full flex flex-col justify-center" :class="isDark ? 'border-white/10 bg-[#050505]' : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'">
          <p class="text-3xl font-serif mb-4" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100'">Prefere Agilidade?</p>
          <p class="text-lg mb-10" :class="isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-600 dark:text-zinc-400'">Agende seu horário diretamente com nossa equipe via WhatsApp.</p>
          
          <button class="bg-[#25D366] text-white font-bold px-8 py-5 text-sm uppercase tracking-wider hover:bg-[#20bd5a] transition-colors flex items-center justify-between group">
            <span class="flex items-center gap-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Chamar no WhatsApp direto
            </span>
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          <p class="text-xs font-bold tracking-[0.1em] uppercase mt-6 flex items-center gap-2" :class="isDark ? 'text-gray-500 dark:text-zinc-400' : 'text-gray-400 dark:text-zinc-500'">
            <span class="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            Resposta em menos de 10 minutos
          </p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="px-10 md:px-20 py-16 border-t flex flex-col md:flex-row justify-between items-start gap-12" :class="isDark ? 'bg-[#050505] border-white/10' : 'bg-gray-100 dark:bg-zinc-800 border-black/10'">
      <div class="max-w-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded flex items-center justify-center font-black text-xl text-theme-inverted bg-theme-primary">
            {{ content.nomeEmpresa ? content.nomeEmpresa.charAt(0).toUpperCase() : niche.fallbackNome.charAt(0) }}
          </div>
          <h2 class="font-bold text-xl leading-none text-theme-primary tracking-tight font-serif">
            {{ content.nomeEmpresa || niche.fallbackNome }}
          </h2>
        </div>
        <p class="text-sm leading-relaxed mb-6" :class="isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-500 dark:text-zinc-400'">
          "Onde a nossa excelência se encontra com a sua necessidade. A melhor opção de serviço para você."
        </p>
      </div>
      
      <div class="flex gap-16">
        <div>
          <p class="font-bold text-xs uppercase tracking-widest mb-6" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100'">Navegação</p>
          <ul class="space-y-4 text-sm" :class="isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-500 dark:text-zinc-400'">
            <li><a href="#" class="hover:text-theme-primary transition-colors">Home</a></li>
            <li><a href="#" class="hover:text-theme-primary transition-colors">Portfolio</a></li>
            <li><a href="#" class="hover:text-theme-primary transition-colors">Galeria</a></li>
            <li><a href="#" class="hover:text-theme-primary transition-colors">Serviços</a></li>
          </ul>
        </div>
        <div>
          <p class="font-bold text-xs uppercase tracking-widest mb-6" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100'">Horários</p>
          <ul class="space-y-4 text-sm" :class="isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-500 dark:text-zinc-400'">
            <li>Seg - Sex:<br>09:00 - 20:00</li>
            <li>Sábado:<br>08:00 - 18:00</li>
            <li>Domingo:<br>Fechado</li>
          </ul>
        </div>
        <div>
          <p class="font-bold text-xs uppercase tracking-widest mb-6" :class="isDark ? 'text-white' : 'text-gray-900 dark:text-zinc-100'">Contato</p>
          <ul class="space-y-4 text-sm" :class="isDark ? 'text-gray-400 dark:text-zinc-500' : 'text-gray-500 dark:text-zinc-400'">
            <li>Av. Principal, 1234 - Centro<br>São Paulo, SP</li>
            <li class="text-theme-primary font-bold mt-4">+55 61 99312-7711</li>
          </ul>
        </div>
      </div>
    </footer>
    
    <div class="px-10 md:px-20 py-6 border-t flex justify-between items-center text-xs font-bold tracking-wider uppercase" :class="isDark ? 'bg-[#000] border-white/5 text-gray-600 dark:text-zinc-400' : 'bg-gray-200 border-black/5 text-gray-400 dark:text-zinc-500'">
      <p>© 2026 {{ content.nomeEmpresa || niche.fallbackNome }}. Todos os direitos reservados.</p>
      <p>Powered by Premium Design Unit</p>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  theme: {
    type: Object,
    required: true,
    default: () => ({
      id: 'barbearia',
      cor: '#eab308',
      temaEscuro: true,
      hero: { tagline: 'Tradição & Estilo', headline: 'Ousadia em', highlight: 'Cada Corte', subheadline: 'Experiência premium de cuidados masculinos.' }
    })
  },
  content: {
    type: Object,
    required: true,
    default: () => ({
      nomeCliente: '',
      nomeEmpresa: '',
      logoUrl: '',
      heroUrl: '',
      sobreTexto: '',
      sobreUrl: ''
    })
  }
})

const isDark = computed(() => props.theme.temaEscuro)

const themeClasses = computed(() => {
  return isDark.value ? 'bg-[#050505] text-white' : 'bg-white text-gray-900'
})

// CSS custom properties
const customVars = computed(() => ({
  '--color-primary': props.theme.cor,
  '--color-inverted': ['#eab308'].includes(props.theme.cor) ? '#000000' : '#ffffff'
}))

// Niches Database
const nichesData = {
  'barbearia': {
    fallbackNome: 'Barbearia Premium',
    stats: { l1: 'Clientes', v1: '5k+', l2: 'Barbeiros', v2: '15', l3: 'Satisfação', v3: '100%' },
    portfolio: { 
      tags: ['Todos', 'Cortes', 'Barba', 'Pigmentação', 'Infantil'], 
      items: [
        { img: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=600&auto=format&fit=crop', tag: 'Cortes', title: 'Fade Moderno' },
        { img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop', tag: 'Barba', title: 'Barba Esculpida' },
        { img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600&auto=format&fit=crop', tag: 'Pigmentação', title: 'Perfil Alinhado' },
        { img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600&auto=format&fit=crop', tag: 'Cortes', title: 'Pompadour Classic' },
        { img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop', tag: 'Infantil', title: 'Corte Kids' },
        { img: 'https://images.unsplash.com/photo-1512496015851-a1fbbfc6d0f9?q=80&w=600&auto=format&fit=crop', tag: 'Premium', title: 'Estilo Premium' }
      ]
    },
    quemSou: { tag: 'A Mente por Trás da Cadeira', title: 'Quem sou eu?', defaultName: 'Cauê Du’corte' },
    avaliacoes: { tag: 'A Voz de Quem Confia', items: [
      { text: "A melhor experiência que já tive em uma barbearia. O Cauê é extremamente detalhista e o ambiente é de altíssimo nível. Recomendo o Royal Combo.", name: "Ricardo Santos", time: "HÁ 2 SEMANAS" },
      { text: "Procurei por anos um barbeiro que entendesse o meu estilo. Encontrei no Cauê o profissional perfeito. O corte fade é impecável.", name: "Gabriel Lima", time: "HÁ 1 MÊS" },
      { text: "Lugar fantástico! Fui atendido pontualmente e o resultado superou minhas expectativas. Café e atendimento nota 1000.", name: "Marcos Oliveira", time: "HÁ 3 DIAS" },
      { text: "Ambiente premium de verdade. É visível o cuidado com cada ferramenta e o carinho com o cliente. Cauê é um artista.", name: "Felipe André", time: "HÁ 1 MÊS" }
    ]},
    contatoTag: 'Onde a Mágica Acontece'
  },
  'despachante': {
    fallbackNome: 'Despachante VIP',
    stats: { l1: 'Processos', v1: '10k+', l2: 'Especialistas', v2: '8', l3: 'Aprovações', v3: '99%' },
    portfolio: { 
      tags: ['Todos', 'Veículos', 'CNH', 'IPVA', 'Transferência'], 
      items: [
        { img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop', tag: 'Veículos', title: 'Primeiro Emplacamento' },
        { img: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=600&auto=format&fit=crop', tag: 'Transferência', title: 'Transferência Ágil' },
        { img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop', tag: 'IPVA', title: 'Regularização' },
        { img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop', tag: 'CNH', title: 'Renovação' },
        { img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop', tag: 'Assessoria', title: 'Documentos' },
        { img: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=600&auto=format&fit=crop', tag: 'Multas', title: 'Recursos' }
      ]
    },
    quemSou: { tag: 'O Especialista por Trás do Serviço', title: 'Quem somos?', defaultName: 'Sérgio Santos' },
    avaliacoes: { tag: 'Clientes Satisfeitos', items: [
      { text: "Resolvi meu documento em 2 dias. Atendimento excelente.", name: "Paulo Souza", time: "HÁ 1 SEMANA" },
      { text: "A burocracia sumiu! Recomendo de olhos fechados.", name: "Carla Mendes", time: "HÁ 2 MESES" },
      { text: "Equipe super transparente, sempre avisando o status do processo.", name: "Jorge Freitas", time: "HÁ 5 DIAS" },
      { text: "Melhor despachante da região. Já indiquei para minha família toda.", name: "Amanda Silva", time: "HÁ 1 MÊS" }
    ]},
    contatoTag: 'Onde a Burocracia Acaba'
  },
  'dentista': {
    fallbackNome: 'Clínica Sorriso',
    stats: { l1: 'Pacientes', v1: '8k+', l2: 'Dentistas', v2: '5', l3: 'Sorrisos', v3: '100%' },
    portfolio: { 
      tags: ['Todos', 'Clareamento', 'Implantes', 'Ortodontia', 'Estética'], 
      items: [
        { img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop', tag: 'Clareamento', title: 'Sorriso Branco' },
        { img: 'https://images.unsplash.com/photo-1598256989800-fea5ce5146ce?q=80&w=600&auto=format&fit=crop', tag: 'Implantes', title: 'Reabilitação' },
        { img: 'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?q=80&w=600&auto=format&fit=crop', tag: 'Estética', title: 'Facetas' },
        { img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop', tag: 'Ortodontia', title: 'Aparelhos Invisíveis' },
        { img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop', tag: 'Limpeza', title: 'Prevenção' },
        { img: 'https://images.unsplash.com/photo-1598256989800-fea5ce5146ce?q=80&w=600&auto=format&fit=crop', tag: 'Infantil', title: 'Odontopediatria' }
      ]
    },
    quemSou: { tag: 'Cuidado e Excelência', title: 'Quem somos?', defaultName: 'Dr. Fernando' },
    avaliacoes: { tag: 'Sorrisos Transformados', items: [
      { text: "Nunca mais tive medo de ir ao dentista. Sensacional!", name: "Bruna Costa", time: "HÁ 3 SEMANAS" },
      { text: "O clareamento ficou perfeito e sem sensibilidade.", name: "Thiago Marques", time: "HÁ 1 MÊS" },
      { text: "Estrutura maravilhosa e profissionais muito atenciosos.", name: "Mariana Reis", time: "HÁ 4 DIAS" },
      { text: "Fiz minhas facetas aqui e mudou minha autoestima.", name: "Juliana Castro", time: "HÁ 2 MESES" }
    ]},
    contatoTag: 'Venha nos Visitar'
  },
  'clinica-olhos': {
    fallbackNome: 'Visão Clínica',
    stats: { l1: 'Cirurgias', v1: '12k+', l2: 'Oftalmos', v2: '6', l3: 'Precisão', v3: '100%' },
    portfolio: { 
      tags: ['Todos', 'Catarata', 'Miopia', 'Retina', 'Exames'], 
      items: [
        { img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop', tag: 'Cirurgia', title: 'Catarata a Laser' },
        { img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=600&auto=format&fit=crop', tag: 'Exames', title: 'Mapeamento de Retina' },
        { img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop', tag: 'Correção', title: 'Cirurgia Refrativa' },
        { img: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?q=80&w=600&auto=format&fit=crop', tag: 'Diagnóstico', title: 'Tomografia Ocular' },
        { img: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?q=80&w=600&auto=format&fit=crop', tag: 'Infantil', title: 'Oftalmopediatria' },
        { img: 'https://images.unsplash.com/photo-1584036533827-45bce166ad94?q=80&w=600&auto=format&fit=crop', tag: 'Tratamento', title: 'Glaucoma' }
      ]
    },
    quemSou: { tag: 'Foco na sua Saúde', title: 'Nosso Corpo Clínico', defaultName: 'Dra. Helena' },
    avaliacoes: { tag: 'Pacientes que Enxergam Melhor', items: [
      { text: "Operei miopia e minha vida mudou. Obrigada equipe!", name: "Fernanda Lima", time: "HÁ 2 SEMANAS" },
      { text: "Minha mãe operou catarata e voltou a ler sem óculos.", name: "Roberto Alves", time: "HÁ 1 MÊS" },
      { text: "Clínica impecável, com tecnologia de ponta.", name: "Célia Regina", time: "HÁ 10 DIAS" },
      { text: "O exame foi muito bem explicado. Profissionais ótimos.", name: "Luiz Gustavo", time: "HÁ 3 MESES" }
    ]},
    contatoTag: 'Agende seu Exame'
  },
  'cerimonialista': {
    fallbackNome: 'Eventos & Sonhos',
    stats: { l1: 'Casamentos', v1: '500+', l2: 'Parceiros', v2: '50', l3: 'Amor', v3: '100%' },
    portfolio: { 
      tags: ['Todos', 'Casamentos', '15 Anos', 'Corporativo', 'Decoração'], 
      items: [
        { img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop', tag: 'Casamentos', title: 'Cerimônia ao Ar Livre' },
        { img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop', tag: 'Decoração', title: 'Estilo Rústico' },
        { img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop', tag: '15 Anos', title: 'Festa Temática' },
        { img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop', tag: 'Recepção', title: 'Detalhes que Encantam' },
        { img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop', tag: 'Casamentos', title: 'Clássico na Igreja' },
        { img: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=600&auto=format&fit=crop', tag: 'Corporativo', title: 'Evento de Gala' }
      ]
    },
    quemSou: { tag: 'Planejando seu Grande Dia', title: 'Sobre Mim', defaultName: 'Camila Cerimonial' },
    avaliacoes: { tag: 'Histórias Felizes', items: [
      { text: "Meu casamento foi perfeito, não me preocupei com absolutamente nada!", name: "Letícia e João", time: "HÁ 1 MÊS" },
      { text: "Organização impecável. A festa de 15 anos da minha filha foi um sonho.", name: "Márcia Vieira", time: "HÁ 3 MESES" },
      { text: "Conseguiram resolver imprevistos sem que os convidados notassem. Nota 10.", name: "Renato Diniz", time: "HÁ 2 SEMANAS" },
      { text: "Indicam os melhores fornecedores. O custo-benefício valeu cada centavo.", name: "Patrícia e Leo", time: "HÁ 5 MESES" }
    ]},
    contatoTag: 'Vamos Tomar um Café?'
  },
  'autocenter': {
    fallbackNome: 'AutoCenter Plus',
    stats: { l1: 'Carros', v1: '20k+', l2: 'Mecânicos', v2: '12', l3: 'Garantia', v3: '100%' },
    portfolio: { 
      tags: ['Todos', 'Motor', 'Suspensão', 'Freios', 'Pneus'], 
      items: [
        { img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop', tag: 'Motor', title: 'Retífica e Manutenção' },
        { img: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=600&auto=format&fit=crop', tag: 'Pneus', title: 'Alinhamento 3D' },
        { img: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=600&auto=format&fit=crop', tag: 'Suspensão', title: 'Troca de Amortecedores' },
        { img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop', tag: 'Freios', title: 'Pastilhas e Discos' },
        { img: 'https://images.unsplash.com/photo-1562259929-b4e1fd3a4b92?q=80&w=600&auto=format&fit=crop', tag: 'Óleo', title: 'Troca de Fluidos' },
        { img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop', tag: 'Injeção', title: 'Diagnóstico Eletrônico' }
      ]
    },
    quemSou: { tag: 'A Oficina de Confiança', title: 'Nossa Equipe', defaultName: 'Carlos AutoCenter' },
    avaliacoes: { tag: 'Clientes que Rodam Tranquilos', items: [
      { text: "Orçamento justo e não inventam problema. Oficina de confiança.", name: "Sandro Gomes", time: "HÁ 1 SEMANA" },
      { text: "Meu carro estava puxando a direção, o alinhamento 3D resolveu na hora.", name: "Tiago Rocha", time: "HÁ 2 SEMANAS" },
      { text: "Fiz a revisão de férias e viajei com minha família em segurança.", name: "Vanessa Moura", time: "HÁ 1 MÊS" },
      { text: "Limpeza, organização e honestidade. Raridade no mercado.", name: "Edgar Silva", time: "HÁ 3 MESES" }
    ]},
    contatoTag: 'Traga seu Veículo'
  }
}

const niche = computed(() => {
  return nichesData[props.theme.id] || nichesData['barbearia']
})

</script>

<style scoped>
.text-theme-primary { color: var(--color-primary); }
.bg-theme-primary { background-color: var(--color-primary); }
.border-theme-primary { border-color: var(--color-primary); }
.text-theme-inverted { color: var(--color-inverted); }
</style>
