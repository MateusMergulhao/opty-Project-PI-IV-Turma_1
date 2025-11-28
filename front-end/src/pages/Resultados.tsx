import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import DashboardNav from '@/components/DashboardNav';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

const Resultados = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || 'iPhone 15 Pro';

  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    stores: [] as string[],
    condition: 'all',
  });

  const [sortBy, setSortBy] = useState('lowest-price');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const stores = [
    { id: 'amazon', name: 'Amazon' },
    { id: 'magalu', name: 'Magazine Luiza' },
    { id: 'mercadolivre', name: 'Mercado Livre' },
    { id: 'americanas', name: 'Americanas' },
    { id: 'submarino', name: 'Submarino' },
    { id: 'casasbahia', name: 'Casas Bahia' },
  ];

  // Mock products data
  const products = [
    {
      name: 'iPhone 15 Pro 256GB Azul Titânio',
      offers: [
        { store: 'Mercado Livre', price: 6450, condition: 'Novo', shipping: 'Grátis', link: '#' },
        { store: 'Amazon', price: 6499, condition: 'Novo', shipping: 'Grátis', link: '#' },
        { store: 'Magazine Luiza', price: 6599, condition: 'Novo', shipping: 'R$ 15,00', link: '#' },
        { store: 'Americanas', price: 6799, condition: 'Novo', shipping: 'R$ 20,00', link: '#' },
        { store: 'Submarino', price: 6850, condition: 'Novo', shipping: 'Grátis', link: '#' },
      ],
    },
    {
      name: 'iPhone 15 Pro 256GB Preto Titânio',
      offers: [
        { store: 'Amazon', price: 6499, condition: 'Novo', shipping: 'Grátis', link: '#' },
        { store: 'Magazine Luiza', price: 6549, condition: 'Novo', shipping: 'Grátis', link: '#' },
        { store: 'Casas Bahia', price: 6699, condition: 'Novo', shipping: 'R$ 25,00', link: '#' },
      ],
    },
    {
      name: 'iPhone 15 Pro 512GB Azul Titânio',
      offers: [
        { store: 'Amazon', price: 7899, condition: 'Novo', shipping: 'Grátis', link: '#' },
        { store: 'Mercado Livre', price: 7799, condition: 'Novo', shipping: 'Grátis', link: '#' },
        { store: 'Magazine Luiza', price: 7999, condition: 'Novo', shipping: 'R$ 30,00', link: '#' },
        { store: 'Americanas', price: 8199, condition: 'Novo', shipping: 'Grátis', link: '#' },
      ],
    },
  ];

  const toggleStore = (storeId: string) => {
    setFilters((prev) => ({
      ...prev,
      stores: prev.stores.includes(storeId)
        ? prev.stores.filter((id) => id !== storeId)
        : [...prev.stores, storeId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 10000,
      stores: [],
      condition: 'all',
    });
  };

  const FilterContent = () => (
    <div className='space-y-6'>
      {/* Clear Filters */}
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold text-lg'>Filtros</h3>
        <Button variant='ghost' size='sm' onClick={clearFilters}>
          Limpar
        </Button>
      </div>

      {/* Price Range */}
      <div>
        <Label className='mb-3 block font-semibold'>Faixa de Preço</Label>
        <div className='space-y-4'>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[filters.priceMin, filters.priceMax]}
            onValueChange={([min, max]) => setFilters({ ...filters, priceMin: min, priceMax: max })}
            className='mb-4'
          />
          <div className='flex gap-2'>
            <div className='flex-1'>
              <Label className='text-xs text-muted-foreground mb-1 block'>Mínimo</Label>
              <Input
                type='number'
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                className='h-9'
              />
            </div>
            <div className='flex-1'>
              <Label className='text-xs text-muted-foreground mb-1 block'>Máximo</Label>
              <Input
                type='number'
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                className='h-9'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stores Filter */}
      <div>
        <Label className='mb-3 block font-semibold'>
          Lojas {filters.stores.length > 0 && `(${filters.stores.length})`}
        </Label>
        <div className='space-y-2'>
          {stores.map((store) => (
            <div key={store.id} className='flex items-center space-x-2'>
              <Checkbox
                id={store.id}
                checked={filters.stores.includes(store.id)}
                onCheckedChange={() => toggleStore(store.id)}
              />
              <Label htmlFor={store.id} className='cursor-pointer font-normal'>
                {store.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <Label className='mb-3 block font-semibold'>Condição</Label>
        <RadioGroup value={filters.condition} onValueChange={(val) => setFilters({ ...filters, condition: val })}>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='all' id='all' />
            <Label htmlFor='all' className='cursor-pointer font-normal'>
              Todos
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='new' id='new' />
            <Label htmlFor='new' className='cursor-pointer font-normal'>
              Novo
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='used' id='used' />
            <Label htmlFor='used' className='cursor-pointer font-normal'>
              Seminovo/Usado
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <DashboardNav userName='João' />

      {/* Breadcrumb */}
      <div className='border-b border-border bg-muted/30'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex items-center gap-2 text-sm'>
            <Link to='/dashboard' className='text-muted-foreground hover:text-primary'>
              Dashboard
            </Link>
            <ChevronRight className='h-4 w-4 text-muted-foreground' />
            <span className='text-foreground font-medium'>Resultados para '{searchQuery}'</span>
          </div>
        </div>
      </div>

      <div className='flex-1 container mx-auto px-4 py-6'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Filters Sidebar - Desktop */}
          <aside className='hidden lg:block w-80 flex-shrink-0'>
            <div className='sticky top-24 glass p-6 rounded-xl'>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className='flex-1'>
            {/* Header */}
            <div className='mb-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
                <div>
                  <h1 className='text-2xl sm:text-3xl font-bold text-foreground mb-2'>
                    Resultados para: <span className='gradient-text'>{searchQuery}</span>
                  </h1>
                  <p className='text-muted-foreground'>
                    Encontramos {products.length} produtos em {stores.length} lojas
                  </p>
                </div>

                {/* Mobile Filters Button */}
                <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                  <SheetTrigger asChild>
                    <Button variant='outline' className='lg:hidden'>
                      <SlidersHorizontal className='h-4 w-4 mr-2' />
                      Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='left' className='w-80'>
                    <SheetHeader>
                      <SheetTitle>Filtros de Busca</SheetTitle>
                    </SheetHeader>
                    <div className='mt-6'>
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort */}
              <div className='flex items-center gap-4'>
                <Label className='text-sm font-medium'>Ordenar por:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='lowest-price'>Menor Preço</SelectItem>
                    <SelectItem value='highest-price'>Maior Preço</SelectItem>
                    <SelectItem value='best-rating'>Melhor Avaliação</SelectItem>
                    <SelectItem value='most-sold'>Mais Vendidos</SelectItem>
                    <SelectItem value='alphabetical'>Ordem Alfabética (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className='space-y-4'>
              {products.map((product, index) => (
                <ProductCard key={index} name={product.name} offers={product.offers} />
              ))}
            </div>

            {/* Empty State (if needed) */}
            {products.length === 0 && (
              <div className='text-center py-12'>
                <div className='text-6xl mb-4'>🔍</div>
                <h3 className='text-xl font-semibold mb-2'>Nenhum resultado encontrado</h3>
                <p className='text-muted-foreground mb-4'>
                  Tente buscar por outro termo ou ajuste os filtros
                </p>
                <Button variant='gradient' onClick={() => window.location.href = '/dashboard'}>
                  Voltar ao Dashboard
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resultados;
