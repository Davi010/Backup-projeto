<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Models;
use Illuminate\Database\Seeder;

class BrandModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar se já existem dados para evitar duplicação
        if (Brand::count() > 0) {
            $this->command->info('Marcas e modelos já existem no banco de dados. Pulando seed...');
            return;
        }

        $brandsAndModels = [
            'LG' => [
                'Multi V S',
                'Standard Plus',
                'Artcool',
                'Dual Inverter',
                'Multi F',
                'Wall Mount',
            ],
            'Samsung' => [
                'Wind-Free',
                'Digital Inverter',
                'AR12',
                'AR18',
                'AR24',
                'AR30',
            ],
            'Daikin' => [
                'Sensira',
                'Perfera',
                'Comfora',
                'VRV',
                'Sky Air',
                'Flexible Multi',
            ],
            'Carrier' => [
                'Infinity',
                'Performance',
                'Comfort',
                'VVT',
                'Aqua Edge',
                'Weathermaker',
            ],
            'Gree' => [
                'Bora',
                'Lomo',
                'U-Match',
                'Bora Plus',
                'Lomo Plus',
                'Flexx',
            ],
            'Consul' => [
                'Inverter',
                'Standard',
                'Eco',
                'Silent',
                'Turbo',
                'Smart',
            ],
            'Electrolux' => [
                'Inverter',
                'Eco',
                'Turbo',
                'Silent',
                'Smart',
                'Premium',
            ],
            'Springer' => [
                'Inverter',
                'Standard',
                'Eco',
                'Turbo',
                'Silent',
            ],
            'York' => [
                'Affinity',
                'Latitude',
                'Sunline',
                'YMA',
                'YCA',
            ],
            'TCL' => [
                'Inverter',
                'Standard',
                'Smart',
                'Eco',
                'Turbo',
            ],
        ];

        $this->command->info('Criando marcas e modelos predefinidos...');

        foreach ($brandsAndModels as $brandName => $modelNames) {
            // Criar marca
            $brand = Brand::create([
                'name' => $brandName,
            ]);

            $this->command->info("  ✓ Marca criada: {$brandName}");

            // Criar modelos para a marca
            foreach ($modelNames as $modelName) {
                Models::create([
                    'name' => $modelName,
                    'brand_id' => $brand->id,
                ]);
            }

            $this->command->info("    → {$modelNames[0]} modelos criados para {$brandName}");
        }

        $totalBrands = Brand::count();
        $totalModels = Models::count();

        $this->command->info("\n✅ Seed concluído!");
        $this->command->info("   Total de marcas: {$totalBrands}");
        $this->command->info("   Total de modelos: {$totalModels}");
    }
}

