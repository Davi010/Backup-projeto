<?php

namespace Tests\Feature;

use App\Models\Brand;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function index_returns_paginated_brands_with_filter_and_sort()
    {
        Brand::create(['name' => 'Samsung']);
        Brand::create(['name' => 'LG']);
        Brand::create(['name' => 'Philips']);

        $response = $this->getJson('/api/brand?name=L&sort=-name&per_page=2');

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data')
                 ->assertJsonFragment(['name' => 'LG']);
    }

    /** @test */
    public function store_creates_a_brand_successfully()
    {
        $payload = ['name' => 'Sony'];

        $response = $this->postJson('/api/brand', $payload);

        $response->assertStatus(201)
                 ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('brands', ['name' => 'Sony']);
    }

    /** @test */
    public function store_fails_when_name_is_missing_or_duplicate()
    {
        Brand::create(['name' => 'Samsung']);

        $response = $this->postJson('/api/brand', []);
        $response->assertStatus(422);

        $response = $this->postJson('/api/brand', ['name' => 'Samsung']);
        $response->assertStatus(422);
    }

    /** @test */
    public function show_returns_brand_or_404()
    {
        $brand = Brand::create(['name' => 'LG']);

        $this->getJson("/api/brand/{$brand->id}")
             ->assertStatus(200)
             ->assertJsonFragment(['name' => 'LG']);

        $this->getJson("/api/brand/999")
             ->assertStatus(404);
    }

    /** @test */
    public function update_changes_brand_name_and_handles_validation()
    {
        $brand = Brand::create(['name' => 'OldName']);
        Brand::create(['name' => 'Existing']);

        $response = $this->putJson("/api/brand/{$brand->id}", ['name' => 'NewName']);
        $response->assertStatus(200);
        $this->assertDatabaseHas('brands', ['name' => 'NewName']);

        $response = $this->putJson("/api/brand/{$brand->id}", ['name' => 'Existing']);
        $response->assertStatus(422);
    }

    /** @test */
    public function destroy_deletes_brand_or_returns_404()
    {
        $brand = Brand::create(['name' => 'Sony']);

        $this->deleteJson("/api/brand/{$brand->id}")
             ->assertStatus(204);

        $this->assertDatabaseMissing('brands', ['id' => $brand->id]);

        $this->deleteJson("/api/brand/999")
             ->assertStatus(404);
    }
}
