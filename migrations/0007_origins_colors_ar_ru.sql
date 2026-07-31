-- Add Arabic + Russian name columns to the origin and color libraries and fill
-- them for the seeded rows. These are short, fixed labels so they are hand
-- translated here rather than machine-translated.

ALTER TABLE origins ADD COLUMN name_ar TEXT;
ALTER TABLE origins ADD COLUMN name_ru TEXT;
ALTER TABLE colors ADD COLUMN name_ar TEXT;
ALTER TABLE colors ADD COLUMN name_ru TEXT;

UPDATE origins SET name_ar = 'اليابان',          name_ru = 'Япония' WHERE id = 'japan';
UPDATE origins SET name_ar = 'أوروبا',            name_ru = 'Европа' WHERE id = 'europe';
UPDATE origins SET name_ar = 'الولايات المتحدة',  name_ru = 'США'    WHERE id = 'usa';

UPDATE colors SET name_ar = 'أسود آبنوسي',  name_ru = 'Чёрный эбеновый'      WHERE id = 'ebony-black';
UPDATE colors SET name_ar = 'أسود لامع',    name_ru = 'Чёрный полированный'  WHERE id = 'polished-black';
UPDATE colors SET name_ar = 'ماهوجني',      name_ru = 'Красное дерево'       WHERE id = 'mahogany';
UPDATE colors SET name_ar = 'جوز',          name_ru = 'Орех'                 WHERE id = 'walnut';
UPDATE colors SET name_ar = 'بلوط',         name_ru = 'Дуб'                  WHERE id = 'oak';
UPDATE colors SET name_ar = 'خشب الورد',    name_ru = 'Палисандр'            WHERE id = 'rosewood';
UPDATE colors SET name_ar = 'أبيض قطبي',    name_ru = 'Полярный белый'       WHERE id = 'polar-white';
UPDATE colors SET name_ar = 'رمادي فضي',    name_ru = 'Серебристо-серый'     WHERE id = 'silver-grey';
