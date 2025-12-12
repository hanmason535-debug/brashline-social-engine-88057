import { WebsiteData, SocialData } from "@/types/work.types";
import navTechnoImg from "@/assets/images/case-studies/nav-techno.png";
import westernHydroImg from "@/assets/images/case-studies/western-hydro.png";
import cafecitoImg from "@/assets/images/case-studies/cafecito.png";
import runningExplainedImg from "@/assets/images/case-studies/running-explained.png";
import oobRestaurantImg from "@/assets/images/case-studies/oob-restaurant.png";
import thompsonLegalImg from "@/assets/images/case-studies/thompson-legal.png";

export const websiteProjects: WebsiteData[] = [
  {
    title: { en: "Nav Techno Solutions", es: "Nav Techno Solutions" },
    description: {
      en: "Modern tech solutions website with sleek design and interactive features",
      es: "Sitio web de soluciones tecnológicas modernas con diseño elegante y funciones interactivas",
    },
    url: "https://navtechno.in/",
    thumbnail: navTechnoImg,
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    category: { en: "Technology", es: "Tecnología" },
  },
  {
    title: { en: "Western Hydro Movers", es: "Western Hydro Movers" },
    description: {
      en: "Professional moving company website with booking system and service showcase",
      es: "Sitio web de empresa de mudanzas profesional con sistema de reservas y exhibición de servicios",
    },
    url: "https://www.westernhydromovers.com/",
    thumbnail: westernHydroImg,
    techStack: ["WordPress", "WooCommerce", "Custom CSS"],
    category: { en: "Services", es: "Servicios" },
  },
  {
    title: { en: "Café Cito Santa Fe", es: "Café Cito Santa Fe" },
    description: {
      en: "Cozy coffee shop website with online ordering and menu showcase",
      es: "Sitio web de cafetería acogedor con pedidos en línea y exhibición de menú",
    },
    url: "https://www.cafecitosantafe.com/",
    thumbnail: cafecitoImg,
    techStack: ["Shopify", "Liquid", "Custom Theme"],
    category: { en: "Food & Beverage", es: "Comida y Bebida" },
  },
  {
    title: { en: "Running Explained", es: "Running Explained" },
    description: {
      en: "Fitness and running blog with training programs and community features",
      es: "Blog de fitness y running con programas de entrenamiento y funciones comunitarias",
    },
    url: "https://www.runningexplained.com/",
    thumbnail: runningExplainedImg,
    techStack: ["WordPress", "Elementor", "WP Forms"],
    category: { en: "Fitness", es: "Fitness" },
  },
  {
    title: { en: "OOB Portland Restaurant", es: "Restaurante OOB Portland" },
    description: {
      en: "Modern restaurant website with interactive menu and reservation system",
      es: "Sitio web de restaurante moderno con menú interactivo y sistema de reservas",
    },
    url: "https://oobpdx.com/",
    thumbnail: oobRestaurantImg,
    techStack: ["React", "Node.js", "OpenTable API"],
    category: { en: "Restaurant", es: "Restaurante" },
  },
  {
    title: { en: "Thompson Legal Services", es: "Servicios Legales Thompson" },
    description: {
      en: "Professional law firm website with case studies and client portal",
      es: "Sitio web de bufete de abogados profesional con estudios de casos y portal de clientes",
    },
    url: "https://www.thomplegal.com/",
    thumbnail: thompsonLegalImg,
    techStack: ["WordPress", "Custom CMS", "SSL Security"],
    category: { en: "Professional Services", es: "Servicios Profesionales" },
  },
];

export const socialPosts: SocialData[] = [
  {
    platform: "instagram",
    type: "single",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    caption: {
      en: "☕️ Grand opening celebration! Come taste our signature latte art. #CafeLife #GrandOpening",
      es: "☕️ ¡Celebración de gran apertura! Ven a probar nuestro arte latte característico. #VidaDeCafé #GranApertura",
    },
    engagement: { likes: 847, comments: 23, saves: 156 },
    timestamp: "2d ago",
  },
  {
    platform: "instagram",
    type: "carousel",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
    caption: {
      en: "🔥 Client transformation in just 8 weeks! Swipe to see the journey. #FitnessGoals #Transformation",
      es: "🔥 ¡Transformación del cliente en solo 8 semanas! Desliza para ver el viaje. #ObjetivosDeEstadoFísico #Transformación",
    },
    engagement: { likes: 1234, comments: 45, saves: 892 },
    timestamp: "3d ago",
  },
  {
    platform: "facebook",
    type: "video",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
    caption: {
      en: "🍴 Chef's special of the week! Watch how we prepare our signature dish. #ChefSpecial #Foodie",
      es: "🍴 ¡Especial del chef de la semana! Mira cómo preparamos nuestro plato característico. #EspecialDelChef #Foodie",
    },
    engagement: { views: 2345, likes: 156, comments: 34, shares: 12 },
    timestamp: "5d ago",
  },
  {
    platform: "instagram",
    type: "single",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=600&fit=crop",
    caption: {
      en: "✨ 5 tips for organizing your home workspace. Save this for later! #HomeOrganization #ProductivityTips",
      es: "✨ 5 consejos para organizar tu espacio de trabajo en casa. ¡Guarda esto para después! #OrganizaciónDelHogar #ConsejosDeProductividad",
    },
    engagement: { likes: 634, saves: 892, comments: 18 },
    timestamp: "1w ago",
  },
  {
    platform: "instagram",
    type: "before-after",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=600&fit=crop",
    caption: {
      en: "🚗 Before & After ceramic coating! Book your detailing appointment today. #CarDetailing #BeforeAfter",
      es: "🚗 ¡Antes y después del recubrimiento cerámico! Reserva tu cita de detallado hoy. #DetalladoDeAutos #AntesDespués",
    },
    engagement: { likes: 1567, comments: 67, shares: 23 },
    timestamp: "1w ago",
  },
  {
    platform: "linkedin",
    type: "single",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=600&fit=crop",
    caption: {
      en: "💼 Success in business requires training, discipline & hard work. #BusinessTips #Motivation",
      es: "💼 El éxito en los negocios requiere entrenamiento, disciplina y trabajo duro. #ConsejosDeNegocios #Motivación",
    },
    engagement: { likes: 423, comments: 12 },
    timestamp: "2w ago",
  },
  {
    platform: "instagram",
    type: "carousel",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=600&fit=crop",
    caption: {
      en: "🏋️ Weekly workout routine for beginners. Swipe through all exercises! #WorkoutRoutine #Fitness",
      es: "🏋️ Rutina de ejercicios semanal para principiantes. ¡Desliza por todos los ejercicios! #RutinaDeEjercicio #Fitness",
    },
    engagement: { likes: 978, comments: 56, saves: 1234 },
    timestamp: "2w ago",
  },
  {
    platform: "facebook",
    type: "single",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop",
    caption: {
      en: "🎉 Customer appreciation week! Special discounts all week long. #CustomerAppreciation #Sale",
      es: "🎉 ¡Semana de apreciación al cliente! Descuentos especiales toda la semana. #ApreciaciónAlCliente #Venta",
    },
    engagement: { likes: 567, comments: 89, shares: 45 },
    timestamp: "2w ago",
  },
  {
    platform: "instagram",
    type: "video",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=600&fit=crop",
    caption: {
      en: "☕️ Behind the scenes: How we roast our signature coffee blend. #CoffeeRoasting #BehindTheScenes",
      es: "☕️ Detrás de escena: Cómo tostamos nuestra mezcla de café característica. #TostadoDeCafé #DetrasDeEscena",
    },
    engagement: { views: 3456, likes: 892, comments: 67 },
    timestamp: "3w ago",
  },
  {
    platform: "instagram",
    type: "single",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop",
    caption: {
      en: "🌿 New plant-based menu items available now! Try our signature bowls. #PlantBased #HealthyEating",
      es: "🌿 ¡Nuevos elementos de menú a base de plantas disponibles ahora! Prueba nuestros tazones característicos. #BaseDeVegetales #AlimentaciónSaludable",
    },
    engagement: { likes: 1123, comments: 45, saves: 678 },
    timestamp: "3w ago",
  },
  {
    platform: "linkedin",
    type: "single",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=600&fit=crop",
    caption: {
      en: "📊 Data-driven decision making: The key to business growth in 2024. #BusinessStrategy #DataAnalytics",
      es: "📊 Toma de decisiones basada en datos: La clave para el crecimiento empresarial en 2024. #EstrategiaEmpresarial #AnálisisDeDatos",
    },
    engagement: { likes: 567, comments: 23 },
    timestamp: "4w ago",
  },
  {
    platform: "facebook",
    type: "carousel",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=600&fit=crop",
    caption: {
      en: "🎯 Team building event highlights! Swipe to see all the fun moments. #TeamBuilding #CompanyCulture",
      es: "🎯 ¡Destacados del evento de construcción de equipo! Desliza para ver todos los momentos divertidos. #ConstrucciónDeEquipo #CulturaEmpresarial",
    },
    engagement: { likes: 789, comments: 34, shares: 56 },
    timestamp: "4w ago",
  },
];
