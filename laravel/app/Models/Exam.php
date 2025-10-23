<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exam extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id',
        'exam_type',
        'description',
        'image_path',
        'exam_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'exam_date' => 'date',
    ];

    /**
     * Relação com paciente
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Relação com resultado do exame
     */
    public function result()
    {
        return $this->hasOne(ExamResult::class);
    }

    /**
     * Scope para exames pendentes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope para exames completos
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Verificar se exame tem resultado
     */
    public function hasResult()
    {
        return $this->result()->exists();
    }
}