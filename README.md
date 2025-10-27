# Retinopatia Diabética – Predição Automática

## Introdução

Este projeto apresenta um sistema web completo capaz de realizar a predição automatizada de **retinopatia diabética** a partir de imagens oculares submetidas por meio de um ambiente clínico simulado. A aplicação integra um modelo de _machine learning_ desenvolvido em **Python (FastAPI)**, uma **API de backend em Laravel** e uma **interface web construída em React**, todos orquestrados por **Docker** para execução integrada e consistente.

A proposta surgiu inicialmente em um contexto acadêmico na disciplina de Inteligência Artificial, ministrada pelo professor Vinicius Godoy, e foi posteriormente aprimorada com o objetivo de demonstrar a aplicação prática de redes neurais na área da saúde, com potencial de uso real em clínicas especializadas.

<!-- Inserir aqui imagem geral da interface do sistema -->

---

## Visão Geral do Sistema

A plataforma foi concebida para simular o ambiente digital de uma clínica médica especializada em exames oftalmológicos. O usuário pode:

- Cadastrar pacientes com dados clínicos e pessoais;
- Cadastrar exames associando imagens de retina ao paciente;
- Submeter exames à análise automática via modelo de IA;
- Gerar relatórios em PDF contendo diagnósticos e recomendações;
- Visualizar um **dashboard** com estatísticas gerais, como número total de pacientes, exames pendentes e casos com detecção de retinopatia.

Cada parte do sistema foi projetada para ser funcional e interdependente, priorizando a clareza da jornada do usuário e a usabilidade dentro de um contexto médico realista.

<!-- Inserir aqui imagem da tela de cadastro de pacientes -->
<!-- Inserir aqui imagem da tela de análise de exame -->
<!-- Inserir aqui imagem do dashboard -->

---

## Arquitetura e Tecnologias

O sistema foi estruturado em três camadas principais, cada uma com uma responsabilidade bem definida:

- **FastAPI (Python)**: responsável pelo processamento das imagens e execução do modelo de _machine learning_.
- **Laravel (PHP)**: atua como API principal do sistema, centralizando o gerenciamento de usuários, pacientes, exames, relatórios e integrações.
- **React (TypeScript)**: responsável pela camada de apresentação, permitindo ao usuário interagir com o sistema de forma fluida e intuitiva.
- **Docker**: utilizado para containerizar todos os serviços, garantindo ambiente controlado, isolamento de dependências e facilidade de implantação.
- **Cloudinary**: plataforma utilizada para o armazenamento das imagens de exames. A decisão de utilizá-la foi motivada pela necessidade de otimizar o desempenho e reduzir a carga sobre o servidor principal, mantendo escalabilidade e acesso rápido aos arquivos.

A separação entre a API de predição (FastAPI) e a API administrativa (Laravel) foi uma escolha arquitetural proposital. Essa divisão permite manter o modelo de IA isolado do restante da aplicação, facilitando atualizações independentes, testes de desempenho e futuras substituições do modelo sem comprometer a integridade do sistema.

---

## Modelo de Machine Learning

O modelo foi desenvolvido em **Python** e treinado no **Google Colab**, utilizando bibliotecas amplamente consolidadas para visão computacional e aprendizado profundo. Seu objetivo é classificar imagens de retina em **cinco categorias distintas**:

- _No_DR_ (Sem retinopatia)
- _Mild_ (Retinopatia leve)
- _Moderate_ (Retinopatia moderada)
- _Severe_ (Retinopatia severa)
- _Proliferate_DR_ (Retinopatia proliferativa)

Durante o treinamento, o modelo atingiu métricas promissoras:

- **Loss:** 0.1161
- **Accuracy:** 0.9618

Esses valores indicam alta capacidade de generalização e precisão nos resultados. O modelo foi ajustado com técnicas de regularização e _augmentation_ de imagens para aprimorar a robustez da detecção e reduzir o impacto de variações na iluminação e contraste.

É importante destacar que as imagens utilizadas já possuem **filtro gaussiano aplicado** previamente, o que contribui para o realce de estruturas relevantes na retina e melhora o desempenho do modelo durante a fase de inferência.

<!-- Inserir aqui imagem ilustrando o gráfico de treinamento (loss/accuracy) -->

Quando um exame é submetido, a FastAPI recebe a imagem, valida o arquivo e utiliza o modelo para gerar a predição. O resultado é então retornado à API Laravel, que o armazena e disponibiliza para visualização e emissão do relatório.

---

## Resultados e Relatórios

Após a análise, o sistema gera automaticamente um **relatório em PDF** contendo todas as informações relevantes do exame, o diagnóstico obtido, probabilidades associadas e recomendações automáticas de reavaliação.

O relatório segue um padrão profissional, destacando dados do paciente, detalhes técnicos da análise e a data da geração. Esse processo representa a última etapa da jornada clínica dentro do sistema, consolidando o ciclo completo: **cadastro → análise → diagnóstico → relatório**.

<!-- Inserir aqui imagem de exemplo do relatório em PDF -->

👉 Exemplo de relatório gerado:

```
DIAGNÓSTICO: COM RETINOPATIA DIABÉTICA
PROBABILIDADES:
• Sem Retinopatia (No_DR): 0.0%
• Com Retinopatia (DR): 100.0%
```

---

## Execução do Projeto

Todos os serviços são executados de forma integrada via **Docker Compose**, garantindo que o ambiente funcione corretamente em qualquer máquina.
Após clonar o repositório, basta executar:

```bash
docker-compose up --build
```

Em poucos instantes, todos os containers (FastAPI, Laravel, React e banco de dados) estarão ativos e interconectados.

👉 Quando a aplicação estiver em execução, acesse no navegador algo como:

```
http://localhost:3000
```

---

## Considerações Finais

O projeto **Retinopatia Diabética – Predição Automática** demonstra o potencial do uso de modelos de _deep learning_ aplicados à medicina, aliado a boas práticas de engenharia de software. A separação entre módulos, a estrutura containerizada e o uso de ferramentas modernas como FastAPI, Laravel e React conferem robustez e escalabilidade à solução.

Mais do que um estudo técnico, o projeto representa uma proposta prática de apoio diagnóstico, que pode futuramente ser expandida com novos modelos e funcionalidades clínicas.

Se você gostou da ideia e do projeto, não esqueça de deixar uma ⭐ no repositório!
