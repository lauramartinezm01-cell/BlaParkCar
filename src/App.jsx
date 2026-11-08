import React, { useState, useMemo } from 'react';
import { 
  Car, MapPin, Calendar, Clock, ShieldCheck, Zap, 
  Key, QrCode, Search, PlusCircle, User, CreditCard, 
  CheckCircle, Sliders, DollarSign, ArrowRight, X, ChevronRight,
  TrendingUp, Award, Lock, Sparkles, Navigation, Bell, Star,
  ToggleLeft, ToggleRight, Radio, RefreshCw, Cpu, Layers, Building, HelpCircle
} from 'lucide-react';

// --- INITIAL NATIONWIDE DATA (Spain) ---
const INITIAL_SPACES = [
  {
    id: 1,
    title: "Plaza amplísima junto a Estación Santa Justa",
    city: "Sevilla",
    neighborhood: "Santa Justa / Nervión",
    address: "Calle Pablo Iglesias, 8",
    pricePerHour: 2.30,
    pricePerDay: 16.00,
    ownerName: "Carlos M.",
    ownerRating: 4.9,
    reviewsCount: 34,
    features: {
      covered: true,
      electricCharger: true,
      autoDoor: true,
      surveillance: true,
      maxSize: "SUV / Grande"
    },
    availableFrom: "2026-11-08T08:00",
    availableTo: "2026-11-15T22:00",
    instructions: "Abrir puerta desde la App usando Bluetooth o PIN 4829 en el teclado exterior.",
    lat: 37.3920,
    lng: -5.9750,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "Plaza VIP junto a Estación de Atocha",
    city: "Madrid",
    neighborhood: "Retiro / Arganzuela",
    address: "Calle de Méndez Álvaro, 12",
    pricePerHour: 3.20,
    pricePerDay: 22.00,
    ownerName: "Patricia L.",
    ownerRating: 4.95,
    reviewsCount: 52,
    features: {
      covered: true,
      electricCharger: true,
      autoDoor: true,
      surveillance: true,
      maxSize: "Cualquier tamaño"
    },
    availableFrom: "2026-11-08T06:00",
    availableTo: "2026-11-20T23:59",
    instructions: "Usa el botón 'Abrir Puerta' en la app al llegar a la rampa de acceso.",
    lat: 40.4050,
    lng: -3.6890,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Garaje céntrico junto a Mezquita - Vial Norte",
    city: "Córdoba",
    neighborhood: "Centro / Vial Norte",
    address: "Avenida de América, 14",
    pricePerHour: 1.90,
    pricePerDay: 13.50,
    ownerName: "Manuel R.",
    ownerRating: 4.85,
    reviewsCount: 22,
    features: {
      covered: true,
      electricCharger: false,
      autoDoor: true,
      surveillance: true,
      maxSize: "Mediano / Berlina"
    },
    availableFrom: "2026-11-08T00:00",
    availableTo: "2026-11-12T23:59",
    instructions: "Plaza 35 en sótano -1. Entrada limpia y vigilada.",
    lat: 37.8890,
    lng: -4.7790,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Plaza subterránea a 3 min de Barcelona Sants",
    city: "Barcelona",
    neighborhood: "Sants / Eixample",
    address: "Carrer de Tarragona, 108",
    pricePerHour: 3.50,
    pricePerDay: 24.00,
    ownerName: "Montserrat G.",
    ownerRating: 4.88,
    reviewsCount: 41,
    features: {
      covered: true,
      electricCharger: true,
      autoDoor: true,
      surveillance: true,
      maxSize: "Mediano / Berlina"
    },
    availableFrom: "2026-11-08T07:00",
    availableTo: "2026-11-18T20:00",
    instructions: "Acceso automatizado por lectura de matrícula o QR en lector del poste.",
    lat: 41.3780,
    lng: 2.1400,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1545179605-1296651e9d43?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    title: "Garaje céntrico Ruzafa con Cargador Coche Eléctrico",
    city: "Valencia",
    neighborhood: "Ruzafa",
    address: "Carrer de Lluís de Santàngel, 5",
    pricePerHour: 2.10,
    pricePerDay: 15.00,
    ownerName: "David K.",
    ownerRating: 4.9,
    reviewsCount: 18,
    features: {
      covered: true,
      electricCharger: true,
      autoDoor: true,
      surveillance: false,
      maxSize: "Cualquier tamaño"
    },
    availableFrom: "2026-11-09T08:00",
    availableTo: "2026-11-16T22:00",
    instructions: "Instrucciones de cargador en la columna. Activar por App BlaParkCar.",
    lat: 39.4620,
    lng: -0.3720,
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600"
  }
];

const POPULAR_CITIES = [
  { name: "Sevilla", spots: 124, keyPoint: "Santa Justa / Nervión" },
  { name: "Madrid", spots: 450, keyPoint: "Atocha / Chamartín" },
  { name: "Barcelona", spots: 380, keyPoint: "Sants / Eixample" },
  { name: "Córdoba", spots: 86, keyPoint: "Centro / Estación" },
  { name: "Valencia", spots: 190, keyPoint: "Ruzafa / AVE Joaquin Sorolla" },
  { name: "Málaga", spots: 140, keyPoint: "María Zambrano / Centro" },
  { name: "Bilbao", spots: 95, keyPoint: "Abando / Indautxu" }
];

export default function App() {
  // --- GLOBAL MODE: 'DRIVER' (Conductor) vs 'OWNER' (Propietario) ---
  const [appMode, setAppMode] = useState('DRIVER'); 

  // Secondary sub-tab states
  const [driverTab, setDriverTab] = useState('search'); // 'search', 'bookings'
  const [ownerTab, setOwnerTab] = useState('dashboard'); // 'dashboard', 'publish'

  // Data States
  const [spaces, setSpaces] = useState(INITIAL_SPACES);
  const [userBookings, setUserBookings] = useState([
    {
      id: "RES-9821",
      spaceId: 1,
      spaceTitle: "Plaza amplísima junto a Estación Santa Justa",
      city: "Sevilla",
      address: "Calle Pablo Iglesias, 8",
      startDate: "2026-11-09T10:00",
      endDate: "2026-11-09T18:00",
      totalHours: 8,
      totalPrice: 18.40,
      pinCode: "8492",
      qrData: "BLAPARK-9821-ESP",
      status: "Activa"
    }
  ]);

  const [myListedSpaces, setMyListedSpaces] = useState([
    {
      id: 101,
      title: "Mi plaza habitual en Sevilla Nervión (Me voy a Córdoba el finde)",
      city: "Sevilla",
      neighborhood: "Nervión",
      address: "Calle San Francisco Javier, 18",
      pricePerHour: 2.20,
      pricePerDay: 15.00,
      isAvailable: true,
      totalEarned: 245.00,
      activeBookingsCount: 3,
      isInstantVacant: true
    }
  ]);

  // Search & Filter State
  const [searchCity, setSearchCity] = useState('');
  const [searchSize, setSearchSize] = useState('todos');
  const [filterCovered, setFilterCovered] = useState(false);
  const [filterCharger, setFilterCharger] = useState(false);
  const [maxPrice, setMaxPrice] = useState(6.00);

  // Booking Modal State
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [bookingStart, setBookingStart] = useState("2026-11-09T09:00");
  const [bookingEnd, setBookingEnd] = useState("2026-11-09T17:00");
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);
  const [isOpeningDoor, setIsOpeningDoor] = useState(false);
  const [doorOpenedSuccess, setDoorOpenedSuccess] = useState(false);

  // Publish Form 4 Steps State
  const [publishStep, setPublishStep] = useState(1);
  const [newSpace, setNewSpace] = useState({
    title: '',
    city: 'Sevilla',
    neighborhood: 'Centro',
    address: '',
    zipCode: '41001',
    pricePerHour: '2.20',
    pricePerDay: '15.00',
    availabilityPattern: 'weekend', // 'weekend', 'workhours', 'full'
    maxSize: 'Mediano / Berlina',
    covered: true,
    electricCharger: false,
    autoDoor: true,
    surveillance: true,
    instructions: ''
  });
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Filtered Spaces calculation
  const filteredSpaces = useMemo(() => {
    return spaces.filter(space => {
      const matchCity = !searchCity || 
        space.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        space.neighborhood.toLowerCase().includes(searchCity.toLowerCase()) ||
        space.address.toLowerCase().includes(searchCity.toLowerCase());
      
      const matchCovered = !filterCovered || space.features.covered;
      const matchCharger = !filterCharger || space.features.electricCharger;
      const matchPrice = space.pricePerHour <= maxPrice;
      const matchSize = searchSize === 'todos' || space.features.maxSize.includes(searchSize);
      
      return matchCity && matchCovered && matchCharger && matchPrice && matchSize && space.isAvailable;
    });
  }, [spaces, searchCity, filterCovered, filterCharger, maxPrice, searchSize]);

  // Price Calculation Logic
  const calculateBookingDetails = () => {
    if (!bookingStart || !bookingEnd || !selectedSpace) return { hours: 0, total: 0, platformFee: 0, insuranceFee: 0 };
    const start = new Date(bookingStart);
    const end = new Date(bookingEnd);
    const diffMs = end - start;
    if (diffMs <= 0) return { hours: 0, total: 0, platformFee: 0, insuranceFee: 0 };
    
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    const rawTotal = hours * selectedSpace.pricePerHour;
    const insuranceFee = 1.20; // Fixed coverage fee
    const platformFee = rawTotal * 0.10; // 10% service fee
    const finalTotal = rawTotal + insuranceFee + platformFee;

    return { 
      hours, 
      subtotal: rawTotal.toFixed(2),
      insuranceFee: insuranceFee.toFixed(2),
      platformFee: platformFee.toFixed(2),
      total: finalTotal.toFixed(2) 
    };
  };

  const bookingCalc = calculateBookingDetails();

  // Handlers
  const handleCreateBooking = () => {
    if (bookingCalc.hours <= 0) return;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const newBooking = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      spaceId: selectedSpace.id,
      spaceTitle: selectedSpace.title,
      city: selectedSpace.city,
      address: selectedSpace.address,
      startDate: bookingStart,
      endDate: bookingEnd,
      totalHours: bookingCalc.hours,
      totalPrice: parseFloat(bookingCalc.total),
      pinCode: pin,
      qrData: `BLAPARK-${pin}-${selectedSpace.id}`,
      status: "Activa"
    };

    setUserBookings([newBooking, ...userBookings]);
    setBookingSuccessModal(newBooking);
    setSelectedSpace(null);
  };

  const handleSimulateOpenDoor = () => {
    setIsOpeningDoor(true);
    setTimeout(() => {
      setIsOpeningDoor(false);
      setDoorOpenedSuccess(true);
      setTimeout(() => setDoorOpenedSuccess(false), 4000);
    }, 1500);
  };

  const handlePublishSpaceSubmit = (e) => {
    e.preventDefault();
    const createdSpace = {
      id: Date.now(),
      title: newSpace.title || `Plaza en ${newSpace.city} (${newSpace.neighborhood})`,
      city: newSpace.city,
      neighborhood: newSpace.neighborhood,
      address: newSpace.address,
      pricePerHour: parseFloat(newSpace.pricePerHour),
      pricePerDay: parseFloat(newSpace.pricePerDay),
      ownerName: "Tú (Anfitrión)",
      ownerRating: 5.0,
      reviewsCount: 1,
      features: {
        covered: newSpace.covered,
        electricCharger: newSpace.electricCharger,
        autoDoor: newSpace.autoDoor,
        surveillance: newSpace.surveillance,
        maxSize: newSpace.maxSize
      },
      availableFrom: "2026-11-08T00:00",
      availableTo: "2026-11-30T23:59",
      instructions: newSpace.instructions || "Acceso digital habilitado por Bluetooth y código PIN en teclado.",
      lat: 40.4167,
      lng: -3.7037,
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600"
    };

    setSpaces([createdSpace, ...spaces]);
    setMyListedSpaces([
      {
        id: createdSpace.id,
        title: createdSpace.title,
        city: createdSpace.city,
        neighborhood: createdSpace.neighborhood,
        address: createdSpace.address,
        pricePerHour: createdSpace.pricePerHour,
        pricePerDay: createdSpace.pricePerDay,
        isAvailable: true,
        totalEarned: 0,
        activeBookingsCount: 0,
        isInstantVacant: true
      },
      ...myListedSpaces
    ]);

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setPublishStep(1);
      setAppMode('OWNER');
      setOwnerTab('dashboard');
    }, 1800);
  };

  const toggleInstantVacancy = (id) => {
    setMyListedSpaces(myListedSpaces.map(sp => {
      if (sp.id === id) {
        const updated = !sp.isInstantVacant;
        // update main spaces array as well
        setSpaces(spaces.map(s => s.id === id ? { ...s, isAvailable: updated } : s));
        return { ...sp, isInstantVacant: updated, isAvailable: updated };
      }
      return sp;
    }));
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
      appMode === 'DRIVER' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* ============================================================ */}
      {/* HEADER WITH PERSISTENT GLOBAL MODE SWITCHER */}
      {/* ============================================================ */}
      <header className={`sticky top-0 z-40 border-b shadow-md transition-colors duration-300 ${
        appMode === 'DRIVER' 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-slate-900 border-emerald-900/60 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Custom BlaBlaCar-Style Logo for BlaParkCar */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              setAppMode('DRIVER');
              setDriverTab('search');
            }}
          >
            {/* Logo Icon SVG: BlaBlaCar speech-bubble style with Garage Door & Entry Car */}
            <div className="flex items-center space-x-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 group-hover:border-emerald-500/50 transition">
              {/* Twin BlaBlaCar Speech Bubble Style Symbols */}
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left Bubble Symbol (BlaBlaCar Style - Car Icon) */}
                <path d="M12 45C12 25.67 27.67 10 47 10C66.33 10 82 25.67 82 45C82 53.8 78.77 61.85 73.4 68L80 85L62.2 79.4C57.5 81.7 52.4 83 47 83C27.67 83 12 67.33 12 45Z" fill="#10B981" />
                
                {/* Garage Door Structure (Open slats) */}
                <rect x="28" y="22" width="38" height="6" rx="2" fill="#0F172A" />
                <rect x="28" y="30" width="38" height="4" rx="1" fill="#0F172A" fillOpacity="0.7" />
                
                {/* Garage Frame / Door Opening */}
                <path d="M26 20V58H32V24H62V58H68V20H26Z" fill="#FFFFFF" />
                
                {/* Car Entering Garage (Slanted Perspective Arrow-Car) */}
                <g transform="translate(0, 4)">
                  {/* Car Body */}
                  <path d="M36 58C36 53.5 39.5 50 44 50H50C54.5 50 58 53.5 58 58L60 67H34L36 58Z" fill="#FFFFFF" />
                  {/* Car Roof */}
                  <path d="M40 50L42 43H52L54 50H40Z" fill="#0F172A" />
                  {/* Motion Entry Arrow inside roof */}
                  <path d="M47 38L47 47M47 38L43 42M47 38L51 42" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Wheels */}
                  <circle cx="39" cy="67" r="3" fill="#0F172A" />
                  <circle cx="55" cy="67" r="3" fill="#0F172A" />
                </g>
              </svg>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">
                  BlaPark<span className={appMode === 'DRIVER' ? 'text-emerald-400' : 'text-violet-400'}>Car</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  España
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Garajes entre particulares</span>
            </div>
          </div>

          {/* --- PERSISTENT MODE TOGGLE SWITCH (CENTER/RIGHT) --- */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setAppMode('DRIVER')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                appMode === 'DRIVER'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Modo Conductor</span>
            </button>

            <button
              onClick={() => setAppMode('OWNER')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                appMode === 'OWNER'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Modo Propietario</span>
            </button>
          </div>

          {/* Mode-Specific Sub Navigation (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            {appMode === 'DRIVER' ? (
              <>
                <button
                  onClick={() => setDriverTab('search')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    driverTab === 'search' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Buscar Plazas
                </button>
                <button
                  onClick={() => setDriverTab('bookings')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                    driverTab === 'bookings' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Mis Reservas</span>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {userBookings.length}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setOwnerTab('dashboard')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    ownerTab === 'dashboard' ? 'bg-slate-800 text-violet-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Panel Anfitrión
                </button>
                <button
                  onClick={() => setOwnerTab('publish')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition bg-violet-600 text-white hover:bg-violet-500 flex items-center space-x-1`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Publicar Plaza</span>
                </button>
              </>
            )}

            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
              ES
            </div>
          </div>
        </div>

        {/* Mobile Navigation Subbar */}
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-2 flex justify-around text-xs">
          {appMode === 'DRIVER' ? (
            <>
              <button 
                onClick={() => setDriverTab('search')}
                className={`font-semibold ${driverTab === 'search' ? 'text-emerald-400' : 'text-slate-400'}`}
              >
                Buscar Plazas
              </button>
              <button 
                onClick={() => setDriverTab('bookings')}
                className={`font-semibold ${driverTab === 'bookings' ? 'text-emerald-400' : 'text-slate-400'}`}
              >
                Mis Reservas ({userBookings.length})
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setOwnerTab('dashboard')}
                className={`font-semibold ${ownerTab === 'dashboard' ? 'text-violet-400' : 'text-slate-400'}`}
              >
                Panel de Control
              </button>
              <button 
                onClick={() => setOwnerTab('publish')}
                className={`font-semibold ${ownerTab === 'publish' ? 'text-violet-400' : 'text-slate-400'}`}
              >
                + Publicar Plaza
              </button>
            </>
          )}
        </div>
      </header>

      {/* ============================================================ */}
      {/* MODO CONDUCTOR BANNER & CONTENT */}
      {/* ============================================================ */}
      {appMode === 'DRIVER' && (
        <div className="flex-1 flex flex-col">
          
          {/* Driver Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Red Nacional de Aparcamientos Privados
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Encuentra parking libre en <span className="text-emerald-400">toda España</span>.
                </h1>
                <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
                  Alquila plazas de garaje privadas en Madrid, Sevilla, Barcelona, Córdoba, Valencia y más cuando sus dueños no las usan.
                </p>
              </div>

              {/* Quick Spain Cities Chips */}
              <div className="flex flex-wrap gap-2 max-w-md">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      setSearchCity(city.name);
                      setDriverTab('search');
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center space-x-1 ${
                      searchCity === city.name 
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' 
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{city.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* DRIVER SUBTAB 1: SEARCH & BOOK */}
            {driverTab === 'search' && (
              <>
                {/* ADVANCED SEARCH FILTERS BAR */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    
                    {/* City / Keyword Input */}
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">¿Dónde buscas garaje en España?</label>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={searchCity}
                          onChange={(e) => setSearchCity(e.target.value)}
                          placeholder="Ej. Madrid, Sevilla Santa Justa, Córdoba..."
                          className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                        />
                        {searchCity && (
                          <button 
                            onClick={() => setSearchCity('')}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Size Filter */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tamaño Vehículo</label>
                      <select
                        value={searchSize}
                        onChange={(e) => setSearchSize(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      >
                        <option value="todos">Todos los tamaños</option>
                        <option value="Berlina">Mediano / Berlina</option>
                        <option value="SUV">SUV / Grande</option>
                        <option value="Furgoneta">Furgoneta</option>
                      </select>
                    </div>

                    {/* Max Price Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Precio Máx</label>
                        <span className="text-xs font-bold text-emerald-600">{maxPrice.toFixed(2)} €/h</span>
                      </div>
                      <input
                        type="range"
                        min="1.00"
                        max="6.00"
                        step="0.50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    {/* Quick Toggles */}
                    <div className="flex items-end space-x-2">
                      <button
                        onClick={() => setFilterCovered(!filterCovered)}
                        className={`flex-1 py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1 transition ${
                          filterCovered 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Cubierto</span>
                      </button>

                      <button
                        onClick={() => setFilterCharger(!filterCharger)}
                        className={`flex-1 py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1 transition ${
                          filterCharger 
                            ? 'bg-cyan-50 border-cyan-500 text-cyan-700 font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Carga EV</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* SEARCH RESULTS & MAP VIEW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* LIST CARDS (2 Cols) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900">
                        Plazas disponibles en España <span className="text-slate-400 font-normal">({filteredSpaces.length})</span>
                      </h2>
                      <span className="text-xs text-slate-500">Reserva instantánea y pase digital</span>
                    </div>

                    {filteredSpaces.length === 0 ? (
                      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
                        <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-700 text-base">No hay plazas con estos criterios</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-4">Prueba a borrar la búsqueda de ciudad o aumentar el rango de precio.</p>
                        <button
                          onClick={() => {
                            setSearchCity('');
                            setFilterCharger(false);
                            setFilterCovered(false);
                            setMaxPrice(6.00);
                          }}
                          className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                        >
                          Restablecer Filtros
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredSpaces.map((space) => (
                          <div 
                            key={space.id} 
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                          >
                            <div>
                              {/* Image & City Tag */}
                              <div className="relative h-44 bg-slate-200 overflow-hidden">
                                <img 
                                  src={space.image} 
                                  alt={space.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{space.city} • {space.neighborhood}</span>
                                </div>

                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 font-black px-3 py-1 rounded-xl text-sm shadow">
                                  {space.pricePerHour.toFixed(2)} € <span className="text-[10px] font-normal text-slate-500">/ hora</span>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="p-4 space-y-3">
                                <h3 className="font-bold text-slate-900 line-clamp-1 text-sm leading-snug">{space.title}</h3>

                                <div className="flex items-center justify-between text-xs text-slate-500">
                                  <p className="flex items-center space-x-1 truncate mr-2">
                                    <Navigation className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{space.address}</span>
                                  </p>
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${space.address}, ${space.city}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 font-bold hover:underline flex items-center shrink-0 space-x-0.5 text-[11px]"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span>Ir en Maps</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </a>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {space.features.covered && (
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                      Cubierto
                                    </span>
                                  )}
                                  {space.features.electricCharger && (
                                    <span className="text-[10px] bg-cyan-50 text-cyan-700 font-semibold px-2 py-0.5 rounded-md flex items-center">
                                      <Zap className="w-2.5 h-2.5 mr-0.5" /> Recarga EV
                                    </span>
                                  )}
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                                    {space.features.maxSize}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Owner Footer */}
                            <div className="p-4 pt-0">
                              <div className="h-px bg-slate-100 mb-3" />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                                    {space.ownerName.charAt(0)}
                                  </div>
                                  <div className="text-xs">
                                    <span className="font-medium text-slate-800 block leading-tight">{space.ownerName}</span>
                                    <span className="text-amber-500 font-bold flex items-center text-[11px]">
                                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> {space.ownerRating} ({space.reviewsCount})
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => setSelectedSpace(space)}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1 shadow-sm"
                                >
                                  <span>Reservar</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NAVIGATE WITH MAPS CARD (REPLACES VECTOR MAP) */}
                  <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between border border-slate-800 shadow-xl space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 flex items-center">
                          <Navigation className="w-4 h-4 mr-1.5" /> Navegación GPS Directa
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          Google Maps / Waze
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-black leading-tight text-white">
                        Llega directo a la puerta de tu plaza de garaje
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Cuando selecciones tu plaza en Sevilla, Madrid, Barcelona o cualquier punto de España, haz clic en el botón de navegación para iniciar la ruta GPS exacta hacia la rampa de acceso del aparcamiento.
                      </p>
                    </div>

                    {/* Active Selected Space Quick Navigation Launcher */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      {filteredSpaces.length > 0 ? (
                        <>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Plaza seleccionada para ruta:</span>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{filteredSpaces[0].title}</h4>
                            <p className="text-xs text-emerald-400 flex items-center">
                              <MapPin className="w-3 h-3 mr-1 shrink-0" />
                              <span className="truncate">{filteredSpaces[0].address}, {filteredSpaces[0].city}</span>
                            </p>
                          </div>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${filteredSpaces[0].address}, ${filteredSpaces[0].city}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg"
                          >
                            <Navigation className="w-4 h-4 fill-slate-950" />
                            <span>Abrir Ruta GPS en Google Maps</span>
                          </a>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 text-center py-4">
                          Filtra o busca una ciudad para obtener el enlace GPS directo a la ubicación.
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center space-x-3 text-xs">
                        <Key className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>Al llegar a la ubicación en Maps, usa la app para abrir la puerta por Bluetooth o teclado PIN.</span>
                      </div>

                      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center space-x-3 text-xs">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>Seguro de Cobertura y Asistencia en Aparcamiento ParkCover (hasta 50.000€).</span>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* DRIVER SUBTAB 2: MY BOOKINGS & DIGITAL PASS */}
            {driverTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Mis Reservas y Pases Digitales</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Control de acceso bluetooth y códigos PIN de tus plazas reservadas en España.</p>
                  </div>
                </div>

                {userBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto">
                    <Key className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">No tienes reservas activas</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Busca una plaza libre para tu próximo viaje por España.</p>
                    <button 
                      onClick={() => setDriverTab('search')}
                      className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      Buscar Plazas
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userBookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4">
                        {/* Header */}
                        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="font-bold text-sm">{booking.id}</span>
                          </div>
                          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            {booking.status}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{booking.city}</span>
                            <h3 className="font-bold text-slate-900 text-base">{booking.spaceTitle}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{booking.address}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                            <div>
                              <span className="text-slate-400 block font-medium">Entrada</span>
                              <span className="font-bold text-slate-800">{new Date(booking.startDate).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-medium">Salida</span>
                              <span className="font-bold text-slate-800">{new Date(booking.endDate).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                          </div>

                          {/* Bluetooth Remote Control & PIN */}
                          <div className="bg-slate-950 text-white rounded-2xl p-4 space-y-3 border border-slate-800">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">PIN Acceso Físico</span>
                                <span className="text-2xl font-mono font-black text-emerald-400 tracking-widest">{booking.pinCode}</span>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg">
                                <QrCode className="w-8 h-8 text-slate-950" />
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800">
                              <button
                                onClick={handleSimulateOpenDoor}
                                disabled={isOpeningDoor}
                                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center space-x-2"
                              >
                                {isOpeningDoor ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Conectando con Garaje (Bluetooth/IoT)...</span>
                                  </>
                                ) : (
                                  <>
                                    <Key className="w-4 h-4" />
                                    <span>Abrir Puerta Garaje por Bluetooth</span>
                                  </>
                                )}
                              </button>

                              {doorOpenedSuccess && (
                                <div className="mt-2 text-center text-[11px] font-bold text-emerald-400 bg-emerald-950/80 p-2 rounded-lg border border-emerald-800">
                                  ¡Señal enviada! Puerta del garaje abriéndose...
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODO PROPIETARIO BANNER & CONTENT */}
      {/* ============================================================ */}
      {appMode === 'OWNER' && (
        <div className="flex-1 flex flex-col">
          
          {/* Owner Hero Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-violet-900/40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/30 mb-3">
                  <Building className="w-3.5 h-3.5 mr-1" /> Modo Anfitrión & Propietario de Garaje
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Rentabiliza tu plaza vacía en <span className="text-violet-400">cualquier ciudad de España</span>.
                </h1>
                <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
                  Si dejas tu plaza libre cuando te vas de viaje o durante tu horario de trabajo, ponla a producir automáticamente con total seguridad.
                </p>
              </div>

              {/* Quick Action */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setOwnerTab('publish')}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-lg flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar Garaje Ahora</span>
                </button>
              </div>
            </div>
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* OWNER SUBTAB 1: DASHBOARD & 1-CLICK INSTANT VACANCY */}
            {ownerTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* METRICS DASHBOARD */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-400 font-medium">Ganancias Totales Acumuladas</div>
                    <div className="text-2xl font-black text-violet-400 mt-1">245,00 €</div>
                    <div className="text-[10px] text-emerald-400 mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +18% este mes en España
                    </div>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-400 font-medium">Plazas Registradas</div>
                    <div className="text-2xl font-black text-white mt-1">{myListedSpaces.length}</div>
                    <div className="text-[10px] text-slate-400 mt-1">En Sevilla Nervión</div>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-400 font-medium">Tasa de Ocupación</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">78%</div>
                    <div className="text-[10px] text-slate-400 mt-1">Fines de semana alta demanda</div>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-400 font-medium">Garantía BlaParkCar</div>
                    <div className="text-lg font-bold text-slate-200 mt-1">50.000 €</div>
                    <div className="text-[10px] text-violet-300 mt-1">Seguro ParkCover Activado</div>
                  </div>
                </div>

                {/* 1-CLICK INSTANT VACANCY CONTROL PANEL */}
                <div className="bg-slate-900 rounded-2xl border border-violet-900/50 p-6 shadow-xl space-y-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h3 className="text-lg font-black text-white">Gestión de Disponibilidad Instantánea (1-Click)</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        ¿Te vas este fin de semana fuera de tu ciudad? Pulsa el botón y tu plaza se pondrá automáticamente en alquiler para otros conductores.
                      </p>
                    </div>

                    <button
                      onClick={() => setOwnerTab('publish')}
                      className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1 self-start md:self-auto"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Añadir otra plaza en España</span>
                    </button>
                  </div>

                  {/* LIST OF OWNER'S PLACES */}
                  <div className="space-y-4">
                    {myListedSpaces.map((mySpace) => (
                      <div key={mySpace.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold bg-violet-900/50 text-violet-300 border border-violet-700/50 px-2 py-0.5 rounded">
                              {mySpace.city}
                            </span>
                            <h4 className="font-bold text-white text-sm">{mySpace.title}</h4>
                          </div>
                          
                          <p className="text-xs text-slate-400 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{mySpace.address}</span>
                          </p>

                          <div className="text-xs text-slate-300 font-semibold pt-1">
                            Tarifa actual: <span className="text-emerald-400">{mySpace.pricePerHour.toFixed(2)} €/h</span> • <span className="text-emerald-400">{mySpace.pricePerDay.toFixed(2)} €/día</span>
                          </div>
                        </div>

                        {/* BIG 1-CLICK TOGGLE BUTTON */}
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between space-x-6">
                          <div>
                            <span className="text-xs font-bold text-slate-300 block">"MI PLAZA ESTÁ VACÍA AHORA"</span>
                            <span className={`text-[11px] font-semibold block mt-0.5 ${mySpace.isInstantVacant ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {mySpace.isInstantVacant ? '● Alquilándose en BlaParkCar' : '○ Pausada (Plaza ocupada por ti)'}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleInstantVacancy(mySpace.id)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center space-x-2 ${
                              mySpace.isInstantVacant
                                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${mySpace.isInstantVacant ? 'animate-spin' : ''}`} />
                            <span>{mySpace.isInstantVacant ? 'Vacía (Alquilando)' : 'Activar Alquiler'}</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>

                {/* SMART LOCK / IOT INTEGRATION INFO */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
                      <Cpu className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">Apertura Digital sin Entregar Llaves</h4>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl">
                        BlaParkCar permite que los inquilinos abran la puerta del garaje desde la app con un mando virtual seguro por Bluetooth o código PIN temporal en el teclado. No necesitas quedar en persona.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-500/30 font-semibold shrink-0">
                    Sistema 100% Automático
                  </span>
                </div>

              </div>
            )}

            {/* OWNER SUBTAB 2: 4-STEP PUBLISH FLOW */}
            {ownerTab === 'publish' && (
              <div className="max-w-3xl mx-auto space-y-6">
                
                <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl">
                  
                  {/* Step Progress Bar Header */}
                  <div className="border-b border-slate-800 pb-5 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                        Paso {publishStep} de 4
                      </span>
                      <span className="text-xs text-slate-400">Publicar Plaza en España</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-violet-500 h-full transition-all duration-300"
                        style={{ width: `${(publishStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {publishSuccess && (
                    <div className="mb-6 p-4 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">¡Plaza registrada y activa en España!</h4>
                        <p className="text-xs">Redirigiendo a tu panel de control de propietario...</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handlePublishSpaceSubmit}>
                    
                    {/* STEP 1: EXACT LOCATION IN SPAIN */}
                    {publishStep === 1 && (
                      <div className="space-y-5 animate-in fade-in">
                        <div>
                          <h3 className="text-lg font-bold text-white">1. Ubicación de tu Plaza de Garaje</h3>
                          <p className="text-xs text-slate-400 mt-1">Indica en qué ciudad y zona de España se encuentra tu garaje.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad en España</label>
                            <select
                              value={newSpace.city}
                              onChange={(e) => setNewSpace({...newSpace, city: e.target.value})}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 text-white"
                            >
                              <option value="Sevilla">Sevilla</option>
                              <option value="Madrid">Madrid</option>
                              <option value="Barcelona">Barcelona</option>
                              <option value="Córdoba">Córdoba</option>
                              <option value="Valencia">Valencia</option>
                              <option value="Málaga">Málaga</option>
                              <option value="Bilbao">Bilbao</option>
                              <option value="Zaragoza">Zaragoza</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Barrio / Zona Puntos Clave</label>
                            <input 
                              type="text"
                              placeholder="Ej. Junto a Estación AVE, Nervión, Centro..."
                              value={newSpace.neighborhood}
                              onChange={(e) => setNewSpace({...newSpace, neighborhood: e.target.value})}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección Exacta (Planta y Nº de Plaza)</label>
                          <input 
                            type="text"
                            placeholder="Ej. Calle de Méndez Álvaro, 14, Planta -1, Plaza 12"
                            value={newSpace.address}
                            onChange={(e) => setNewSpace({...newSpace, address: e.target.value})}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 text-white"
                            required
                          />
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            type="button"
                            onClick={() => setPublishStep(2)}
                            className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center space-x-1"
                          >
                            <span>Siguiente: Disponibilidad</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: AVAILABILITY RECURRENCE */}
                    {publishStep === 2 && (
                      <div className="space-y-5 animate-in fade-in">
                        <div>
                          <h3 className="text-lg font-bold text-white">2. Patrón de Disponibilidad</h3>
                          <p className="text-xs text-slate-400 mt-1">¿Cuándo suele quedarse tu plaza libre?</p>
                        </div>

                        <div className="space-y-3">
                          <label 
                            onClick={() => setNewSpace({...newSpace, availabilityPattern: 'weekend'})}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              newSpace.availabilityPattern === 'weekend' 
                                ? 'bg-violet-950/60 border-violet-500 text-white' 
                                : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-violet-400" />
                              <div>
                                <span className="font-bold text-sm block">Fines de Semana (Ej. Me voy a Córdoba/Madrid)</span>
                                <span className="text-xs text-slate-400">Disponible desde el Viernes a las 15:00 hasta el Domingo noche</span>
                              </div>
                            </div>
                            <input 
                              type="radio" 
                              name="pattern"
                              checked={newSpace.availabilityPattern === 'weekend'} 
                              readOnly
                              className="accent-violet-500"
                            />
                          </label>

                          <label 
                            onClick={() => setNewSpace({...newSpace, availabilityPattern: 'workhours'})}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              newSpace.availabilityPattern === 'workhours' 
                                ? 'bg-violet-950/60 border-violet-500 text-white' 
                                : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Clock className="w-5 h-5 text-violet-400" />
                              <div>
                                <span className="font-bold text-sm block">Horario Laboral (Lunes a Viernes)</span>
                                <span className="text-xs text-slate-400">Disponible de 08:00 a 18:00 mientras trabajas fuera</span>
                              </div>
                            </div>
                            <input 
                              type="radio" 
                              name="pattern"
                              checked={newSpace.availabilityPattern === 'workhours'} 
                              readOnly
                              className="accent-violet-500"
                            />
                          </label>
                        </div>

                        <div className="flex justify-between pt-4">
                          <button
                            type="button"
                            onClick={() => setPublishStep(1)}
                            className="text-slate-400 hover:text-white text-xs font-semibold px-4 py-2"
                          >
                            Atrás
                          </button>
                          <button
                            type="button"
                            onClick={() => setPublishStep(3)}
                            className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center space-x-1"
                          >
                            <span>Siguiente: Características</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: FEATURES & ACCESS */}
                    {publishStep === 3 && (
                      <div className="space-y-5 animate-in fade-in">
                        <div>
                          <h3 className="text-lg font-bold text-white">3. Equipamiento de la Plaza</h3>
                          <p className="text-xs text-slate-400 mt-1">Selecciona los extras que tiene tu garaje.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Tamaño máximo recomendado</label>
                          <select
                            value={newSpace.maxSize}
                            onChange={(e) => setNewSpace({...newSpace, maxSize: e.target.value})}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 text-white"
                          >
                            <option value="Mediano / Berlina">Mediano / Berlina (Ej. Golf, Seat León)</option>
                            <option value="SUV / Grande">Grande / SUV (Ej. Nissan Qashqai, BMW X5)</option>
                            <option value="Furgoneta">Furgoneta / Altura Especial</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center space-x-2 text-xs font-medium text-slate-300 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={newSpace.covered} 
                              onChange={(e) => setNewSpace({...newSpace, covered: e.target.checked})}
                              className="accent-violet-500"
                            />
                            <span>Garaje Cubierto</span>
                          </label>

                          <label className="flex items-center space-x-2 text-xs font-medium text-slate-300 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={newSpace.electricCharger} 
                              onChange={(e) => setNewSpace({...newSpace, electricCharger: e.target.checked})}
                              className="accent-violet-500"
                            />
                            <span>Cargador Coche Eléctrico</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Instrucciones de entrada para inquilino</label>
                          <textarea 
                            rows={2}
                            placeholder="Ej. El inquilino abrirá por Bluetooth desde la app o introducirá el PIN en el teclado de entrada."
                            value={newSpace.instructions}
                            onChange={(e) => setNewSpace({...newSpace, instructions: e.target.value})}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 text-white"
                          />
                        </div>

                        <div className="flex justify-between pt-4">
                          <button
                            type="button"
                            onClick={() => setPublishStep(2)}
                            className="text-slate-400 hover:text-white text-xs font-semibold px-4 py-2"
                          >
                            Atrás
                          </button>
                          <button
                            type="button"
                            onClick={() => setPublishStep(4)}
                            className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center space-x-1"
                          >
                            <span>Siguiente: Precios IA</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: IA RECOMMENDED PRICING & ESTIMATED EARNINGS */}
                    {publishStep === 4 && (
                      <div className="space-y-5 animate-in fade-in">
                        <div>
                          <h3 className="text-lg font-bold text-white">4. Precio Recomendado IA y Ganancias</h3>
                          <p className="text-xs text-slate-400 mt-1">Calculado según la demanda media en {newSpace.city}.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Precio Hora (€)</label>
                            <input 
                              type="number"
                              step="0.10"
                              value={newSpace.pricePerHour}
                              onChange={(e) => setNewSpace({...newSpace, pricePerHour: e.target.value})}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 text-white"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Precio Día Completo (€)</label>
                            <input 
                              type="number"
                              step="0.50"
                              value={newSpace.pricePerDay}
                              onChange={(e) => setNewSpace({...newSpace, pricePerDay: e.target.value})}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 text-white"
                              required
                            />
                          </div>
                        </div>

                        {/* ESTIMATOR CARD */}
                        <div className="bg-gradient-to-r from-violet-950 to-indigo-950 p-4 rounded-xl border border-violet-800 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <DollarSign className="w-6 h-6 text-emerald-400" />
                            <div>
                              <div className="text-xs text-slate-300">Ingresos Mensuales Estimados ({newSpace.city})</div>
                              <div className="text-xl font-black text-emerald-400">
                                ~{(parseFloat(newSpace.pricePerDay || 0) * 12 * 0.85).toFixed(2)} € / mes
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">Comisión BlaParkCar: 15%</span>
                        </div>

                        <div className="flex justify-between pt-4">
                          <button
                            type="button"
                            onClick={() => setPublishStep(3)}
                            className="text-slate-400 hover:text-white text-xs font-semibold px-4 py-2"
                          >
                            Atrás
                          </button>
                          <button
                            type="submit"
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-8 py-3 rounded-xl transition shadow-lg flex items-center space-x-2"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>Confirmar y Publicar en España</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </form>
                </div>

              </div>
            )}

          </main>
        </div>
      )}

      {/* ============================================================ */}
      {/* CHECKOUT MODAL WITH BREAKDOWN */}
      {/* ============================================================ */}
      {selectedSpace && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 text-slate-900 animate-in zoom-in duration-200">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Reserva Garaje en España</span>
                <h3 className="font-bold text-base leading-tight">{selectedSpace.title}</h3>
                <span className="text-xs text-slate-400">{selectedSpace.city} • {selectedSpace.neighborhood}</span>
              </div>
              <button 
                onClick={() => setSelectedSpace(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Entrada deseada</label>
                  <input 
                    type="datetime-local" 
                    value={bookingStart}
                    onChange={(e) => setBookingStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Salida estimada</label>
                  <input 
                    type="datetime-local" 
                    value={bookingEnd}
                    onChange={(e) => setBookingEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal plaza ({bookingCalc.hours}h x {selectedSpace.pricePerHour.toFixed(2)}€):</span>
                  <span className="font-semibold">{bookingCalc.subtotal} €</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Seguro Protección BlaParkCar (50.000€):</span>
                  <span className="font-semibold">{bookingCalc.insuranceFee} €</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Gastos de gestión plataforma:</span>
                  <span className="font-semibold">{bookingCalc.platformFee} €</span>
                </div>
                <div className="h-px bg-slate-200 my-1" />
                <div className="flex justify-between text-base font-black text-slate-900">
                  <span>Total Final:</span>
                  <span className="text-emerald-600">{bookingCalc.total} €</span>
                </div>
              </div>

              <button
                onClick={handleCreateBooking}
                disabled={bookingCalc.hours <= 0}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl transition shadow-md flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Pagar {bookingCalc.total} € y Obtener Pase Digital</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUCCESS CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 p-6 text-center space-y-5 text-slate-900 animate-in zoom-in duration-200">
            
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">¡Reserva Confirmada en {bookingSuccessModal.city}!</h3>
              <p className="text-xs text-slate-500 mt-1">Acceso digital habilitado inmediatamente.</p>
            </div>

            <div className="bg-slate-950 text-white p-4 rounded-2xl space-y-3 text-left border border-slate-800">
              <div className="bg-slate-900 p-3 rounded-xl text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">PIN Teclado / Cerradura Smart</span>
                <span className="text-3xl font-mono font-black text-emerald-400 tracking-widest">{bookingSuccessModal.pinCode}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setBookingSuccessModal(null);
                setDriverTab('bookings');
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Ir a Mis Reservas y Probar Mando Bluetooth
            </button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 font-black text-[10px]">P</div>
            <span className="font-bold text-white">BlaParkCar España</span>
            <span>© 2026 - Red Nacional de Alquiler de Plazas Temporales.</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">Seguro ParkCover 50.000€</a>
            <a href="#" className="hover:text-white">Apertura IoT Bluetooth</a>
            <a href="#" className="hover:text-white">Soporte 24h</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
