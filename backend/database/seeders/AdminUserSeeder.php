<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = 'admin@clinicvision.test';

        // evita duplicar se já existir
        if (User::where('email', $email)->exists()) {
            $this->command->info("Admin já existe: {$email}");
            return;
        }

        User::create([
            'name' => 'Administrador',
            'email' => $email,
            'password' => Hash::make('12345678'),
            'role' => 'admin',
        ]);

        $this->command->info("Usuário admin criado: {$email} (senha: 12345678)");
    }
}
