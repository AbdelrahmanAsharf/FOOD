import { ProductWithRelations } from '@/types/product';
import MenuItem from './MenuItem';
import { Extra } from '@prisma/client';


async function Menu({ items, allExtras }: { items: ProductWithRelations[]; allExtras: Extra[] }) {
  return items.length > 0 ? (
    <ul className='grid grid-cols-1 sm:grid-cols-3 gap-4 py-9'>
      {items.map((item) => (
        <MenuItem key={item.id} item={item} allExtras={allExtras} />
      ))}
    </ul>
  ) : (
    <p className='text-gray-600 text-center'>No Products Found</p>
  );
}

export default Menu;