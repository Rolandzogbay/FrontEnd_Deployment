<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-slate-50 text-slate-900">
    <NavBar />

    <!-- HERO -->
    <section class="relative overflow-hidden pt-30 sm:pt-34 lg:pt-38 pb-12 sm:pb-14 lg:pb-18">
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute left-1/2 top-0 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-orange-200/40 blur-3xl sm:h-[440px] sm:w-[440px]">
        </div>
        <div class="absolute right-[-60px] top-20 h-[240px] w-[240px] rounded-full bg-amber-100/50 blur-3xl"></div>
        <div class="absolute left-[-60px] bottom-0 h-[220px] w-[220px] rounded-full bg-orange-100/50 blur-3xl"></div>
      </div>

      <div class="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <!-- LEFT -->
          <div class="text-center lg:text-left">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-orange-500"></span>
              Built for modern African businesses
            </div>

            <h1
              class="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05] xl:text-[4.25rem]">
              Run inventory,
              <span class="mt-2 block text-system">sales, and reporting</span>
              from one smart platform
            </h1>

            <p
              class="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:mx-0 lg:max-w-xl xl:max-w-2xl">
              Track products in real time, monitor business performance, reduce stock loss, and make faster decisions
              with a system built to help businesses stay organized and grow confidently.
            </p>

            <div class="mt-8">
              <template v-if="!auth.isAuthenticated">
                <RouterLink to="/signup" class="inline-block w-full sm:w-auto">
                  <Button
                    class="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500 sm:w-auto">
                    Start Free
                    <i class="fa-solid fa-arrow-right transition-transform duration-300 group-hover:translate-x-1"></i>
                  </Button>
                </RouterLink>

                <p class="mt-4 text-sm text-slate-500">
                  Already have an account?
                  <RouterLink to="/login" class="font-semibold text-orange-600 transition hover:text-orange-500">
                    Log in
                  </RouterLink>
                </p>
              </template>

              <template v-else>
                <div
                  class="inline-flex max-w-xl items-start gap-3 rounded-2xl border border-orange-100 bg-white/90 px-4 py-4 text-left shadow-sm">
                  <div
                    class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <i class="fa-solid fa-circle-check"></i>
                  </div>

                  <div>
                    <p class="text-sm font-semibold text-slate-900">
                      Welcome back, {{ auth.user?.name || "there" }}.
                    </p>
                    <p class="mt-1 text-sm leading-6 text-slate-600">
                      Your business workspace is ready. Continue managing inventory, tracking sales, and monitoring
                      performance from your dashboard.
                    </p>

                    <div class="mt-4">
                      <RouterLink :to="dashboardPath">
                        <Button
                          class="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500">
                          Open Dashboard
                          <i class="fa-solid fa-arrow-right"></i>
                        </Button>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Dynamic stats -->
            <div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div v-for="stat in animatedStats" :key="stat.label"
                class="rounded-2xl border border-orange-100/80 bg-white/95 p-4 text-left shadow-sm ring-1 ring-orange-50">
                <h3 class="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {{ formatStat(stat.display) }}<span v-if="stat.suffix">{{ stat.suffix }}</span>
                </h3>
                <p class="mt-1 text-sm text-slate-500">{{ stat.label }}</p>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="relative">
            <div
              class="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-orange-200/40 via-amber-100/30 to-orange-100/30 blur-2xl">
            </div>

            <div
              class="relative overflow-hidden rounded-[2rem] border border-orange-100/80 bg-white/90 p-3 shadow-[0_30px_80px_rgba(249,115,22,0.16)] backdrop-blur sm:p-4">
              <div class="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50">
                <img :src="dashboardPreview" alt="Dashboard preview"
                  class="h-[260px] w-full object-cover object-top sm:h-[360px] lg:h-[450px] xl:h-[500px]" />
              </div>

              <div
                class="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/40 bg-white/92 p-4 shadow-xl backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-auto sm:w-[310px]">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Live overview</p>
                <h4 class="mt-1 text-sm font-bold text-slate-900">Sales, stock, and analytics in one place</h4>

                <div class="mt-3 grid grid-cols-2 gap-3">
                  <div class="rounded-xl bg-orange-50 p-3">
                    <p class="text-[11px] text-slate-500">Products</p>
                    <h5 class="text-base font-bold text-slate-900">1,280</h5>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-3">
                    <p class="text-[11px] text-slate-500">Alerts</p>
                    <h5 class="text-base font-bold text-slate-900">18</h5>
                  </div>
                </div>
              </div>

              <div
                class="absolute right-3 top-5 hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-xl md:block xl:right-5">
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <i class="fa-solid fa-chart-column"></i>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500">Reports</p>
                    <h4 class="text-sm font-bold text-slate-900">Fast business insights</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- END RIGHT -->
        </div>
      </div>
    </section>

    <!-- TRUSTED BY -->
    <section class="pb-8 sm:pb-10">
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div class="rounded-[28px] border border-orange-100 bg-white px-5 py-6 shadow-sm sm:px-6 lg:px-7">
          <div class="mb-5 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Trusted by</p>
              <h3 class="text-lg font-bold text-slate-900 sm:text-xl">
                Growing businesses across Liberia and beyond
              </h3>
            </div>
          </div>

          <div class="marquee-wrapper" v-if="duplicatedTrustedBusinesses.length">
            <div class="marquee-track">
              <div v-for="(business, index) in duplicatedTrustedBusinesses" :key="`${business.id}-${index}`"
                class="marquee-item">
                <img v-if="business.logo" :src="business.logo" :alt="business.name"
                  class="h-8 w-auto object-contain opacity-80" />
                <span v-else class="whitespace-nowrap text-sm font-bold text-slate-700">
                  {{ business.name }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div v-for="n in 6" :key="n" class="h-16 animate-pulse rounded-2xl border border-orange-100 bg-orange-50">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="relative py-14 sm:py-16 lg:py-20">
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Features</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Powerful tools to run your business better
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            Everything you need to manage inventory, sales, reporting, and business performance from one place.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Card v-for="feature in features" :key="feature.title"
            class="group rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-system shadow-sm transition-transform duration-300 group-hover:scale-110">
              <i :class="[feature.icon, 'text-2xl']"></i>
            </div>

            <h3 class="mt-5 text-xl font-bold text-slate-900">{{ feature.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              {{ feature.description }}
            </p>
          </Card>
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="bg-slate-50 py-14 sm:py-16 lg:py-20">
      <div
        class="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-4 sm:px-5 md:px-6 lg:grid-cols-2 lg:px-8 xl:px-10">
        <div class="order-2 lg:order-1">
          <span class="section-badge">About us</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Built for businesses that want to grow smarter
          </h2>

          <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            We are building a modern inventory platform designed especially for African businesses. Our mission is to
            help businesses manage stock, monitor sales, reduce waste, and grow with the power of simple technology.
          </p>

          <p class="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            From real-time stock alerts to financial insights and accessible dashboards, we make business management
            easier across mobile, tablet, and desktop.
          </p>

          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-white bg-white p-5 shadow-sm">
              <h4 class="font-bold text-slate-900">Simple to use</h4>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Designed for everyday business owners, managers, and teams.
              </p>
            </div>

            <div class="rounded-2xl border border-white bg-white p-5 shadow-sm">
              <h4 class="font-bold text-slate-900">Accessible anywhere</h4>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Stay connected to your business from any device with ease.
              </p>
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2">
          <div class="relative mx-auto max-w-2xl">
            <div class="absolute -inset-4 rounded-[2rem] bg-orange-200/30 blur-2xl"></div>
            <div class="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-4 shadow-xl">
              <img src="../assets/about.webp" alt="About illustration"
                class="animate-float h-auto w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="py-14 sm:py-16 lg:py-20">
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Pricing</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Simple pricing for every business size
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            Transparent plans that grow with your business.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card v-for="(plan, idx) in plans" :key="plan.name" :class="[
            'relative flex h-full flex-col rounded-[28px] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8',
            idx === 1 ? 'border-orange-300 ring-2 ring-orange-100' : 'border-slate-200',
          ]">
            <div v-if="idx === 1"
              class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
              Most Popular
            </div>

            <h3 class="text-2xl font-bold text-slate-900">{{ plan.name }}</h3>
            <p class="mt-3 text-4xl font-extrabold text-system">{{ plan.price }}</p>
            <p class="mt-2 text-sm text-slate-500">
              Everything you need to get started and grow confidently.
            </p>

            <ul class="mt-6 space-y-3 text-slate-700">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
                <i class="fa-solid fa-check mt-1 text-orange-500"></i>
                <span>{{ feature }}</span>
              </li>
            </ul>

            <RouterLink to="/signup" class="mt-8 block w-full">
              <Button :class="[
                'w-full rounded-xl px-5 py-3 font-semibold transition-all duration-300',
                idx === 1
                  ? 'bg-orange-600 text-white hover:bg-orange-500'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100',
              ]">
                Choose Plan
              </Button>
            </RouterLink>
          </Card>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section id="testimonials" class="bg-slate-50 py-14 sm:py-16 lg:py-20">
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Testimonials</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            A word from our customers
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            Businesses trust our platform to stay organized and make better decisions.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card v-for="t in testimonials" :key="t.name"
            class="relative rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
            <div class="mb-5 flex items-center justify-between">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <i class="fa-solid fa-quote-left text-xl"></i>
              </div>
              <div class="flex text-orange-400">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
            </div>

            <p class="text-base leading-8 text-slate-600">“{{ t.message }}”</p>

            <div class="mt-6 flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 text-lg font-bold text-orange-700">
                {{ t.name.charAt(0) }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900">{{ t.name }}</h3>
                <p class="text-sm text-slate-500">{{ t.business }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="py-14 sm:py-16 lg:py-20">
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Our team</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Meet the people behind the product
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            A passionate team working to build a better business platform.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Card v-for="member in team" :key="member.name"
            class="group rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
            <div
              class="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 bg-orange-50 shadow-sm sm:h-32 sm:w-32">
              <img :src="member.image" :alt="member.name" class="h-full w-full object-cover" />
            </div>
            <h3 class="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">{{ member.name }}</h3>
            <p class="mt-1 font-semibold text-system">{{ member.role }}</p>
            <p class="mt-3 text-sm leading-7 text-slate-500">{{ member.desc }}</p>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-4 py-8 sm:px-5 md:px-6 lg:px-8 xl:px-10">
      <div
        class="mx-auto w-full overflow-hidden rounded-4xl border border-orange-200 bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 px-6 py-12 text-white shadow-2xl sm:px-8 sm:py-14 lg:px-12 lg:py-16 xl:px-14 xl:py-18">
        <div class="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">Ready to grow?</p>
            <h2 class="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Start managing your business smarter today
            </h2>
            <p class="mt-4 max-w-2xl text-base leading-8 text-orange-50 sm:text-lg">
              Bring your inventory, sales, reports, and stock visibility together in one simple platform built for
              modern business operations.
            </p>
          </div>

          <div class="flex flex-col items-start gap-4 lg:items-end">
            <RouterLink v-if="!auth.isAuthenticated" to="/signup">
              <Button
                class="rounded-xl bg-white px-6 py-3.5 font-semibold text-orange-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-50">
                Get Started Now
              </Button>
            </RouterLink>

            <RouterLink v-else :to="dashboardPath">
              <Button
                class="rounded-xl bg-white px-6 py-3.5 font-semibold text-orange-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-50">
                Continue to Dashboard
              </Button>
            </RouterLink>

            <p class="text-sm text-orange-100">
              {{ auth.isAuthenticated ?
                "You’re signed in and ready to continue." :
                "No complicated setup.Start fast and scale with confidence." }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="bg-slate-50 py-14 sm:py-16 lg:py-20">
      <div class="mx-auto w-full max-w-[1400px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-badge">Contact us</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            We’d love to hear from you
          </h2>
          <p class="mt-4 text-base text-slate-600 sm:text-lg">
            Reach out with questions, feedback, or partnership opportunities.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <!-- LEFT -->
          <div class="space-y-6">
            <div class="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">
              <iframe class="h-[280px] w-full sm:h-[360px]"
                src="https://www.google.com/maps?q=Monrovia%20Liberia&output=embed" loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-system">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <h3 class="font-bold text-slate-900">Address</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">Broad Street, Monrovia, Liberia</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-system">
                  <i class="fa-solid fa-phone"></i>
                </div>
                <h3 class="font-bold text-slate-900">Phone</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">+231 770 123 456</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-system">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <h3 class="font-bold text-slate-900">Email</h3>
                <p class="mt-2 break-all text-sm leading-6 text-slate-600">support@checkitnana.com</p>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <form class="space-y-5" @submit.prevent="submitContactForm">
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">Your Name</label>
                <input v-model="contactForm.name" type="text" placeholder="Enter your name"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">Your Email</label>
                <input v-model="contactForm.email" type="email" placeholder="Enter your email"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-700">Your Message</label>
                <textarea v-model="contactForm.message" rows="6" placeholder="Type your message..."
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"></textarea>
              </div>

              <Button type="submit" :disabled="contactSubmitting"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70">
                <template v-if="contactSubmitting">
                  <i class="fa-solid fa-spinner animate-spin"></i>
                  Sending...
                </template>
                <template v-else>
                  Send Message
                  <i class="fa-solid fa-paper-plane"></i>
                </template>
              </Button>

              <p v-if="contactMessage" class="text-sm font-medium text-emerald-600">
                {{ contactMessage }}
              </p>
            </form>

            <div class="mt-8 border-t border-slate-100 pt-6 text-center">
              <p class="mb-4 text-lg font-semibold text-slate-900">Follow us</p>
              <div class="flex justify-center gap-4">
                <a href="#" class="social-icon"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-github"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="mt-8 bg-slate-950 text-white">
      <div class="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 md:px-6 lg:px-8 lg:py-16 xl:px-10">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div class="flex items-center gap-3">
              <img src="../assets/CalltoAction.jpg" alt="Logo"
                class="h-12 w-12 rounded-full border border-orange-400 object-cover shadow" />
              <span class="text-2xl font-extrabold tracking-tight text-system">Check it NaNa</span>
            </div>
            <p class="mt-4 max-w-sm text-sm leading-7 text-slate-400 sm:text-base">
              Modern inventory management for Liberian and African businesses looking to scale efficiently.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white">Quick Links</h3>
            <ul class="mt-4 space-y-3 text-slate-400">
              <li><router-link to="/" class="footer-link">Home</router-link></li>
              <li><a href="#features" class="footer-link">Features</a></li>
              <li><a href="#pricing" class="footer-link">Pricing</a></li>
              <li><a href="#contact" class="footer-link">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white">Features</h3>
            <ul class="mt-4 space-y-3 text-slate-400">
              <li><span class="footer-link cursor-pointer">Inventory Tracking</span></li>
              <li><span class="footer-link cursor-pointer">Reporting & Analytics</span></li>
              <li><span class="footer-link cursor-pointer">Stock Alerts</span></li>
              <li><span class="footer-link cursor-pointer">Financial Management</span></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-bold text-white">Contact</h3>
            <div class="mt-4 space-y-4 text-slate-400">
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-location-dot mt-1 text-orange-400"></i>
                <span>Broad Street, Monrovia, Liberia</span>
              </div>
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-phone mt-1 text-orange-400"></i>
                <span>+231 770 123 456</span>
              </div>
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-envelope mt-1 text-orange-400"></i>
                <span>support@checkitnana.com</span>
              </div>
            </div>

            <div class="mt-5 flex gap-3">
              <a href="#" class="footer-social"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" class="footer-social"><i class="fa-brands fa-twitter"></i></a>
              <a href="#" class="footer-social"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="#" class="footer-social"><i class="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>

        <div class="mt-10 border-t border-slate-800 pt-6 text-center">
          <p class="text-sm font-medium text-slate-400 sm:text-base">
            © 2026 Check it NaNa. All rights reserved. Powered by
            <span class="font-semibold text-system">Orange Digital Center</span>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useHead } from "@vueuse/head";
import { useAuthStore } from "@/stores/auth.store";
import NavBar from "@/components/NavBar.vue";
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";

const auth = useAuthStore();

const dashboardPath = computed(() =>
  auth.user?.role === "system_admin" ? "/admin" : "/dashboard"
);

useHead({
  title: "Inventory Management System",
  meta: [
    {
      name: "description",
      content: "Modern inventory management system for African businesses.",
    },
    {
      name: "keywords",
      content: "inventory, stock management, POS, business software",
    },
  ],
});

const dashboardPreview = new URL("../assets/dashboard-preview.png", import.meta.url).href;

const stats = [
  { label: "Businesses", value: 500, suffix: "+" },
  { label: "Products Tracked", value: 10000, suffix: "+" },
  { label: "Reports Generated", value: 24000, suffix: "+" },
  { label: "System Uptime", value: 99.9, suffix: "%" },
];

const animatedStats = ref(
  stats.map((item) => ({
    ...item,
    display: 0,
  }))
);

function animateValue(index, end, duration = 1600) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentValue = Number.isInteger(end)
      ? Math.floor(progress * end)
      : Number((progress * end).toFixed(1));

    animatedStats.value[index].display = currentValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      animatedStats.value[index].display = end;
    }
  }

  requestAnimationFrame(update);
}

function formatStat(value) {
  if (typeof value === "number" && value >= 1000) {
    return value.toLocaleString();
  }
  return value;
}

const trustedBusinesses = ref([]);

const duplicatedTrustedBusinesses = computed(() => [
  ...trustedBusinesses.value,
  ...trustedBusinesses.value,
]);

async function fetchTrustedBusinesses() {
  try {
    trustedBusinesses.value = [
      { id: 1, name: "City Mart", logo: "" },
      { id: 2, name: "Prime Pharmacy", logo: "" },
      { id: 3, name: "Royal Wholesale", logo: "" },
      { id: 4, name: "Smart Tech Hub", logo: "" },
      { id: 5, name: "GoodLife Store", logo: "" },
      { id: 6, name: "Market Square", logo: "" },
    ];
  } catch (error) {
    console.error("Failed to fetch trusted businesses", error);
    trustedBusinesses.value = [];
  }
}

const features = [
  {
    title: "Inventory Tracking",
    description:
      "Monitor stock levels in real time, know what is available, and reduce costly inventory mistakes.",
    icon: "fa-solid fa-boxes-stacked",
  },
  {
    title: "Reporting & Analytics",
    description:
      "Get clear business insights with reports that help you understand performance and make better decisions.",
    icon: "fa-solid fa-chart-line",
  },
  {
    title: "Stock Alerts",
    description:
      "Receive notifications when products are low or out of stock so you can restock before sales are affected.",
    icon: "fa-solid fa-bell",
  },
  {
    title: "Financial Management",
    description:
      "Track sales, expenses, and profits with dashboards that keep your business health visible and simple.",
    icon: "fa-solid fa-coins",
  },
];

const testimonials = [
  {
    name: "James Cooper",
    business: "Mini Mart Owner",
    message: "This system helped me track stock better, reduce losses, and stay more organized every day.",
  },
  {
    name: "Mary Johnson",
    business: "Pharmacy Manager",
    message: "Sales reporting is clean, easy to understand, and very useful for decision-making.",
  },
  {
    name: "Samuel Doe",
    business: "Wholesale Supplier",
    message: "One of the best tools I have used for managing products and business operations efficiently.",
  },
];

const team = [
  {
    name: "Roland Zogbay",
    role: "Senior Developer",
    desc: "A full-stack developer and designer focused on building practical, innovative digital products that solve real business problems.",
    image: new URL("../assets/Roland.jpg", import.meta.url).href,
  },
  {
    name: "Gifty Matthews",
    role: "Team Lead",
    desc: "A strong product-minded leader guiding the team’s execution, collaboration, and delivery toward a clear vision.",
    image: new URL("../assets/gift.jpeg", import.meta.url).href,
  },
  {
    name: "Edward Tim Sackie",
    role: "Backend Engineer",
    desc: "Focused on scalable backend systems, reliable APIs, and the technical foundation that keeps the platform strong.",
    image: new URL("../assets/tims.jpeg", import.meta.url).href,
  },
];

const plans = [
  {
    name: "Starter",
    price: "$5 / month",
    features: ["Stock tracking", "Basic reports", "Email support"],
  },
  {
    name: "Business",
    price: "$15 / month",
    features: ["Advanced reports", "Low stock alerts", "Multi-user access"],
  },
  {
    name: "Enterprise",
    price: "$30 / month",
    features: ["Unlimited products", "Financial analysis", "Priority support"],
  },
];

const contactForm = ref({
  name: "",
  email: "",
  message: "",
});

const contactSubmitting = ref(false);
const contactMessage = ref("");

async function submitContactForm() {
  contactSubmitting.value = true;
  contactMessage.value = "";

  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    contactMessage.value = "Your message has been sent successfully.";
    contactForm.value = {
      name: "",
      email: "",
      message: "",
    };
  } catch (error) {
    console.error(error);
    contactMessage.value = "Something went wrong. Please try again.";
  } finally {
    contactSubmitting.value = false;
  }
}

onMounted(() => {
  animatedStats.value.forEach((item, index) => {
    animateValue(index, item.value);
  });

  fetchTrustedBusinesses();
});
</script>

<style scoped>
.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.section-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid rgba(249, 115, 22, 0.18);
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ea580c;
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.08);
}

.social-icon {
  display: inline-flex;
  height: 2.8rem;
  width: 2.8rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #fff7ed;
  color: #f97316;
  transition: all 0.25s ease;
}

.social-icon:hover {
  transform: translateY(-2px);
  background: #f97316;
  color: white;
}

.footer-link {
  transition: color 0.25s ease;
}

.footer-link:hover {
  color: #fb923c;
}

.footer-social {
  display: inline-flex;
  height: 2.4rem;
  width: 2.4rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  transition: all 0.25s ease;
}

.footer-social:hover {
  background: #f97316;
  color: white;
  transform: translateY(-2px);
}

.marquee-wrapper {
  overflow: hidden;
  position: relative;
  width: 100%;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
  gap: 1rem;
}

.marquee-item {
  display: flex;
  min-width: 180px;
  height: 64px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  padding: 0 1.25rem;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>