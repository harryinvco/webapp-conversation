export interface Product {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Όλα τα Προϊόντα', icon: '📦' },
  { id: 'paints', name: 'Μπογιές', icon: '🎨' },
  { id: 'covers', name: 'Καπάκια & Σχάρες', icon: '🔲' },
  { id: 'insulation', name: 'Θερμομόνωση & Ηχομόνωση', icon: '🧱' },
]

export const PRODUCTS: Product[] = [
  // Μπογιές (Paints)
  {
    id: 'exterior-acrylics',
    name: 'Ακρυλικά Εξωτερικής Χρήσης',
    description: 'Υψηλής ποιότητας ακρυλικά χρώματα για εξωτερικούς χώρους με εξαιρετική αντοχή στις καιρικές συνθήκες.',
    price: 'Επικοινωνήστε μαζί μας',
    image: '/products/paints/exterior-acrylics.jpg',
    category: 'paints',
  },
  {
    id: 'varnish-paints',
    name: 'Βερνικοχρώματα',
    description: 'Επαγγελματικά βερνικοχρώματα για ξύλινες επιφάνειες με μεγάλη διάρκεια και λαμπερό φινίρισμα.',
    price: 'Επικοινωνήστε μαζί μας',
    image: '/products/paints/varnish-paints.jpg',
    category: 'paints',
  },

  // Καπάκια & Σχάρες (Covers & Grills)
  {
    id: 'cast-iron-covers',
    name: 'Ματεμένια Καπάκια',
    description: 'Ανθεκτικά ματεμένια καπάκια για φρεάτια και υπόνομους. Υψηλή αντοχή σε βάρος και φθορά.',
    price: 'Επικοινωνήστε μαζί μας',
    image: '/products/covers/cast-iron-covers.jpg',
    category: 'covers',
  },
  {
    id: 'cast-iron-grills',
    name: 'Ματεμένιες Σχάρες',
    description: 'Ποιοτικές ματεμένιες σχάρες αποστράγγισης για δρόμους, πεζοδρόμια και βιομηχανικούς χώρους.',
    price: 'Επικοινωνήστε μαζί μας',
    image: '/products/covers/cast-iron-grills.jpg',
    category: 'covers',
  },

  // Θερμομόνωση & Ηχομόνωση (Insulation)
  {
    id: 'thermal-sound-insulation',
    name: 'Θερμομόνωση & Ηχομόνωση',
    description: 'Ολοκληρωμένες λύσεις θερμομόνωσης και ηχομόνωσης για κτίρια και βιομηχανικές εφαρμογές.',
    price: 'Επικοινωνήστε μαζί μας',
    image: '/products/insulation/thermal-sound-insulation.jpg',
    category: 'insulation',
  },
  {
    id: 'polystyrene-xps-eps',
    name: 'Πολυστερίνες XPS & EPS',
    description: 'Μονωτικές πλάκες πολυστερίνης XPS και EPS για θερμομόνωση τοίχων, δαπέδων και οροφών.',
    price: 'Επικοινωνήστε μαζί μας',
    image: '/products/insulation/polystyrene-xps-eps.jpg',
    category: 'insulation',
  },
]

export function getProductsByCategory(categoryId: string): Product[] {
  if (categoryId === 'all') return PRODUCTS
  return PRODUCTS.filter(p => p.category === categoryId)
}
