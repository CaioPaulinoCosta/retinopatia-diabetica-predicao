<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'diagnosis',
        'diagnosis_severity',
        'probability_dr',
        'probability_no_dr',
        'confidence',
        'class_predicted',
        'recommendation',
        'doctor_notes',
        'ml_api_response',
        'is_auto_diagnosis',
        'analyzed_at'
    ];

    protected $casts = [
        'probability_dr' => 'float',
        'probability_no_dr' => 'float',
        'confidence' => 'float',
        'is_auto_diagnosis' => 'boolean',
        'analyzed_at' => 'datetime'
    ];

    /**
     * Relação com exame
     */
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function scopeByDiagnosis($query, $diagnosis)
    {
        return $query->where('diagnosis', $diagnosis);
    }

    /**
     * Scope para diagnósticos automáticos
     */
    public function scopeAutoDiagnosis($query)
    {
        return $query->where('is_auto_diagnosis', true);
    }

    /**
     * Scope para diagnósticos manuais
     */
    public function scopeManualDiagnosis($query)
    {
        return $query->where('is_auto_diagnosis', false);
    }

    /**
     * Marcar como analisado
     */
    public function markAsAnalyzed()
    {
        $this->update(['analyzed_at' => now()]);
    }

    /**
     * Verificar se é resultado da ML API
     */
    public function isFromML()
    {
        return $this->is_auto_diagnosis && !empty($this->ml_api_response);
    }
}