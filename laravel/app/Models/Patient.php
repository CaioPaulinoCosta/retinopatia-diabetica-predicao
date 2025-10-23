<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'birth_date',
        'gender',
        'address',
        'emergency_contact',
        'medical_history',
        'allergies',
        'current_medications',
        'insurance_provider',
        'insurance_number',
        'has_diabetes',
        'additional_notes',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'has_diabetes' => 'boolean',
    ];

    /**
     * Relação com exames
     */
    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    /**
     * Calcular idade do paciente
     */
    public function getAgeAttribute()
    {
        return $this->birth_date->age;
    }

    /**
     * Scope para pacientes com diabetes
     */
    public function scopeWithDiabetes($query)
    {
        return $query->where('has_diabetes', true);
    }

    /**
     * Scope para buscar pacientes por nome
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%");
    }
}