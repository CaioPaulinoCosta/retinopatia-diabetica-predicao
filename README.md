# Retinopatia Diabética – Predição Automática

## Introdução

Este projeto apresenta um sistema web completo capaz de realizar a predição automatizada de **retinopatia diabética** a partir de imagens oculares submetidas por meio de um ambiente clínico simulado. A aplicação integra um modelo de _machine learning_ desenvolvido inicialmente no **Google Colab**, posteriormente disponibilizado via **FastAPI**, uma **API de backend em Laravel** e uma **interface web construída em React + Next.js**, todos orquestrados por **Docker**.

A proposta surgiu em um contexto acadêmico na disciplina de Inteligência Artificial, ministrada pelo professor Vinicius Godoy, e foi posteriormente aprimorada com o objetivo de demonstrar a aplicação prática de redes neurais na área da saúde.

---

## Visão Geral do Sistema

A plataforma simula o ambiente digital de uma clínica médica especializada, permitindo:

- Cadastro de pacientes e exames;
- Upload de imagens de retina;
- Análise automática via modelo de IA;
- Geração de relatórios em PDF;
- Visualização de um dashboard com métricas gerais.

---

## Arquitetura e Tecnologias

O sistema é dividido em três módulos principais:

- **FastAPI (Python)**: utilizado para carregar o modelo de machine learning e realizar as predições de maneira rápida, escalável e fácil de atualizar.
- **Laravel (PHP)**: API administrativa central, responsável pelo gerenciamento de pacientes, exames, usuários e integrações.
- **React + Next.js (TypeScript)**: frontend do projeto, oferecendo maior performance, SSR/SSG e experiência fluida ao usuário.
- **Docker**: containerização dos serviços.
- **Cloudinary**: armazenamento otimizado das imagens enviadas.

---

## Modelo de Machine Learning

O modelo foi **desenvolvido e treinado inicialmente no Google Colab**, permitindo experimentação rápida, testes controlados e monitoramento das métricas.

Durante o treinamento, o modelo atingiu:

- **Accuracy:** 0.9618
- **Loss:** 0.1161

Esses resultados demonstram excelente precisão na classificação das imagens entre:

- No_DR
- Mild
- Moderate
- Severe
- Proliferate_DR

Após validado, o modelo foi integrado ao backend por meio do **FastAPI**, possibilitando:

- Respostas mais rápidas
- Maior segurança e veracidade nos resultados
- Facilidade para futuras atualizações do modelo

---

## Resultados e Relatórios

O sistema gera automaticamente relatórios em PDF contendo:

- Dados do paciente
- Diagnóstico obtido
- Probabilidades das classes
- Data e informações técnicas

---

## Execução do Projeto

```bash
docker-compose up --build
```

A aplicação ficará disponível em:

```
👉 http://localhost:3000
```

---

## Considerações Finais

O projeto demonstra a integração de IA com engenharia de software moderna, utilizando um modelo treinado no Google Colab, servido via FastAPI, e acessado por uma interface desenvolvida em **React + Next.js**.

Se você gostou da ideia e do projeto, não esqueça de deixar uma ⭐ no repositório!
