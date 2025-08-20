import { useLanguage } from './language-provider';
import { Category } from '@shared/schema';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const { language } = useLanguage();
  
  const name = language === 'uz' ? category.nameUz : category.nameRu;
  const description = language === 'uz' ? category.descriptionUz : category.descriptionRu;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 text-center group cursor-pointer"
      onClick={onClick}
      data-testid={`card-category-${category.slug}`}
    >
      {category.image && (
        <img 
          src={category.image} 
          alt={name} 
          className="w-full h-32 object-cover rounded-lg mb-4"
          data-testid={`img-category-${category.slug}`}
        />
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors" data-testid={`text-category-name-${category.slug}`}>
        {name}
      </h3>
      {description && (
        <p className="text-gray-600 mb-4" data-testid={`text-category-description-${category.slug}`}>
          {description}
        </p>
      )}
      <div className="text-sm text-success font-medium" data-testid={`text-category-count-${category.slug}`}>
        1000+ {language === 'uz' ? 'mahsulot' : 'товаров'}
      </div>
    </div>
  );
}
