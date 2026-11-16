export const cars = [
  {
    id: 'nissan-sunny-2024', brand: 'Nissan', model: 'Sunny', name: 'Nissan Sunny', year: 2024,
    category: 'economy', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 2,
    pricePerDay: 1450, currency: 'EGP', sortOrder: 1, featured: true, published: true,
    description: 'A familiar, easy-going sedan made for Cairo errands and relaxed day trips. The Sunny pairs a roomy cabin with simple controls and sensible running comfort.',
    features: ['Air conditioning', 'Bluetooth audio', 'Rear parking sensors', 'USB charging', 'ABS brakes', 'Dual airbags'],
    images: ['/assets/cars/nissan-sunny.jpg'], locationLabel: 'Cairo & Giza'
  },
  {
    id: 'renault-logan-2023', brand: 'Renault', model: 'Logan', name: 'Renault Logan', year: 2023,
    category: 'economy', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
    pricePerDay: 1375, currency: 'EGP', sortOrder: 2, featured: false, published: true,
    description: 'Practical space without fuss. The Logan is a dependable choice for longer stays, with a useful boot and comfortable seating for five.',
    features: ['Air conditioning', 'Bluetooth', 'Large boot', 'Front airbags', 'Cruise control', 'USB port'],
    images: ['/assets/cars/renault-logan.jpg'], locationLabel: 'Cairo'
  },
  {
    id: 'mg5-2024', brand: 'MG', model: '5', name: 'MG 5', year: 2024,
    category: 'sedan', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
    pricePerDay: 1750, currency: 'EGP', sortOrder: 3, featured: true, published: true,
    description: 'A polished modern sedan with a quiet cabin and everyday technology. Well suited to business visits, airport runs, and weekend escapes.',
    features: ['Touchscreen display', 'Apple CarPlay', 'Rear camera', 'Keyless entry', 'Cruise control', 'LED running lights'],
    images: ['/assets/cars/mg5.jpg'], locationLabel: 'Cairo & New Cairo'
  },
  {
    id: 'toyota-corolla-2024', brand: 'Toyota', model: 'Corolla', name: 'Toyota Corolla', year: 2024,
    category: 'sedan', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
    pricePerDay: 2200, currency: 'EGP', sortOrder: 4, featured: true, published: true,
    description: 'Composed, refined, and instantly familiar. The Corolla is an excellent all-rounder for city driving and intercity journeys alike.',
    features: ['Climate control', 'Apple CarPlay', 'Android Auto', 'Rear camera', 'Adaptive cruise control', 'Lane assist'],
    images: ['/assets/cars/toyota-corolla.jpg'], locationLabel: 'Cairo & Alexandria'
  },
  {
    id: 'hyundai-elantra-cn7-2024', brand: 'Hyundai', model: 'Elantra CN7', name: 'Hyundai Elantra CN7', year: 2024,
    category: 'sedan', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
    pricePerDay: 2350, currency: 'EGP', sortOrder: 5, featured: false, published: true,
    description: 'Sharp styling meets a spacious, technology-led interior. A confident choice when you want a little extra presence without moving to an SUV.',
    features: ['Digital instruments', 'Touchscreen', 'Wireless charging', 'Rear camera', 'Smart key', 'Drive modes'],
    images: ['/assets/cars/hyundai-elantra.jpg'], locationLabel: 'Cairo'
  },
  {
    id: 'kia-sportage-2024', brand: 'Kia', model: 'Sportage', name: 'Kia Sportage', year: 2024,
    category: 'suv', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 4,
    pricePerDay: 3300, currency: 'EGP', sortOrder: 6, featured: true, published: true,
    description: 'A confident family SUV with generous cabin space, elevated visibility, and a refined ride for busy city streets or the open road.',
    features: ['Dual-zone climate', 'Panoramic roof', 'Apple CarPlay', 'Rear camera', 'Parking sensors', 'Multiple airbags'],
    images: ['/assets/cars/kia-sportage.jpg'], locationLabel: 'Cairo & Giza'
  },
  {
    id: 'hyundai-tucson-2024', brand: 'Hyundai', model: 'Tucson', name: 'Hyundai Tucson', year: 2024,
    category: 'suv', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 4,
    pricePerDay: 3500, currency: 'EGP', sortOrder: 7, featured: false, published: true,
    description: 'A roomy crossover with contemporary design and reassuring road manners. Ideal for families carrying luggage or planning a longer Egyptian road trip.',
    features: ['Climate control', 'Touchscreen', 'Apple CarPlay', 'Blind-spot monitor', 'Rear camera', 'Smart key'],
    images: ['/assets/cars/hyundai-tucson.jpg'], locationLabel: 'Cairo & Alexandria'
  },
  {
    id: 'peugeot-5008-2023', brand: 'Peugeot', model: '5008', name: 'Peugeot 5008', year: 2023,
    category: 'family', transmission: 'automatic', seats: 7, fuelType: 'petrol', luggage: 4,
    pricePerDay: 3900, currency: 'EGP', sortOrder: 8, featured: true, published: true,
    description: 'Seven-seat flexibility in a handsome European SUV. Foldable rear seating makes room for people, luggage, or a practical mix of both.',
    features: ['Seven seats', 'Digital cockpit', 'Panoramic roof', 'Rear camera', 'Apple CarPlay', 'Parking sensors'],
    images: ['/assets/cars/peugeot-5008.jpg'], locationLabel: 'Cairo'
  },
  {
    id: 'toyota-fortuner-2024', brand: 'Toyota', model: 'Fortuner', name: 'Toyota Fortuner', year: 2024,
    category: 'family', transmission: 'automatic', seats: 7, fuelType: 'petrol', luggage: 4,
    pricePerDay: 4800, currency: 'EGP', sortOrder: 9, featured: false, published: true,
    description: 'A substantial seven-seat SUV for larger groups and long-distance travel. Strong road presence and a flexible cabin make it a capable tourer.',
    features: ['Seven seats', 'Three-zone climate', 'Rear camera', 'Cruise control', 'Keyless start', 'Hill assist'],
    images: ['/assets/cars/toyota-fortuner.jpg'], locationLabel: 'Cairo & Giza'
  },
  {
    id: 'skoda-kodiaq-2024', brand: 'Škoda', model: 'Kodiaq', name: 'Škoda Kodiaq', year: 2024,
    category: 'family', transmission: 'automatic', seats: 7, fuelType: 'petrol', luggage: 4,
    pricePerDay: 4250, currency: 'EGP', sortOrder: 10, featured: false, published: true,
    description: 'Cleverly packaged and calm on the move, the Kodiaq offers seven-seat practicality with a premium-feeling cabin and useful storage throughout.',
    features: ['Seven seats', 'Virtual cockpit', 'Tri-zone climate', 'Power tailgate', 'Rear camera', 'Apple CarPlay'],
    images: ['/assets/cars/skoda-kodiaq.jpg'], locationLabel: 'New Cairo'
  },
  {
    id: 'mercedes-c180-2023', brand: 'Mercedes-Benz', model: 'C 180', name: 'Mercedes-Benz C 180', year: 2023,
    category: 'premium', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
    pricePerDay: 5500, currency: 'EGP', sortOrder: 11, featured: true, published: true,
    description: 'Elegant, quiet, and beautifully finished. The C-Class brings a sense of occasion to business travel and special weekends.',
    features: ['MBUX display', 'Leather interior', 'Ambient lighting', 'Rear camera', 'Cruise control', 'Dual-zone climate'],
    images: ['/assets/cars/mercedes-c180.jpg'], locationLabel: 'Cairo'
  },
  {
    id: 'bmw-320i-2023', brand: 'BMW', model: '320i', name: 'BMW 320i', year: 2023,
    category: 'premium', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
    pricePerDay: 5750, currency: 'EGP', sortOrder: 12, featured: false, published: true,
    description: 'A focused sports sedan that remains comfortable every day. The 3 Series combines precise handling with a considered, driver-led cabin.',
    features: ['Leather interior', 'Navigation', 'Apple CarPlay', 'Parking camera', 'Drive modes', 'LED headlights'],
    images: ['/assets/cars/bmw-320i.jpg'], locationLabel: 'Cairo & New Cairo'
  },
  {
    id: 'audi-q3-2023', brand: 'Audi', model: 'Q3', name: 'Audi Q3', year: 2023,
    category: 'premium', transmission: 'automatic', seats: 5, fuelType: 'petrol', luggage: 3,
    pricePerDay: 5200, currency: 'EGP', sortOrder: 13, featured: false, published: true,
    description: 'Compact enough for the city and sophisticated enough for an occasion, the Q3 offers premium comfort in a versatile crossover shape.',
    features: ['Virtual cockpit', 'Leather interior', 'Parking camera', 'Apple CarPlay', 'Dual-zone climate', 'LED headlights'],
    images: ['/assets/cars/audi-q3.jpg'], locationLabel: 'Cairo'
  },
  {
    id: 'mitsubishi-xpander-2024', brand: 'Mitsubishi', model: 'Xpander', name: 'Mitsubishi Xpander', year: 2024,
    category: 'family', transmission: 'automatic', seats: 7, fuelType: 'petrol', luggage: 3,
    pricePerDay: 2850, currency: 'EGP', sortOrder: 14, featured: false, published: true,
    description: 'A friendly seven-seater designed around real family needs. Easy access, flexible rows, and sensible dimensions make group travel straightforward.',
    features: ['Seven seats', 'Rear air vents', 'Touchscreen', 'Rear camera', 'Keyless entry', 'Fold-flat seats'],
    images: ['/assets/cars/mitsubishi-xpander.jpg'], locationLabel: 'Cairo & Giza'
  }
];

export const categories = ['economy', 'sedan', 'suv', 'family', 'premium'];
