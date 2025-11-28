<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Brand;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BrandTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_brand()
    {
        $brand = Brand::create(['name' => 'Samsung']);

        $this->assertDatabaseHas('brands', [
            'name' => 'Samsung',
        ]);

        $this->assertInstanceOf(Brand::class, $brand);
        $this->assertEquals('Samsung', $brand->name);
    }

    /** @test */
    public function it_has_timestamps()
    {
        $brand = Brand::create(['name' => 'LG']);

        $this->assertNotNull($brand->created_at);
        $this->assertNotNull($brand->updated_at);
    }

    /** @test */
    public function it_can_update_a_brand()
    {
        $brand = Brand::create(['name' => 'Philips']);
        $brand->update(['name' => 'Philips Updated']);

        $this->assertDatabaseHas('brands', [
            'name' => 'Philips Updated',
        ]);
    }

    /** @test */
    public function it_can_delete_a_brand()
    {
        $brand = Brand::create(['name' => 'Sony']);
        $brand->delete();

        $this->assertDatabaseMissing('brands', [
            'name' => 'Sony',
        ]);
    }
}
