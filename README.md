
# 🚀 E-Agenda - Sistema de Comunicação Educacional

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

Sistema de comunicação integrado para instituições de ensino do Sistema Logosófico.

## 📋 Pré-requisitos

- Docker instalado ([Instalação](https://docs.docker.com/get-docker/))
- Docker Compose ([Instalação](https://docs.docker.com/compose/install/))
- Git ([Instalação](https://git-scm.com/downloads))

## 🛠️ Começando

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/e-agenda.git
cd e-agenda
```

### 2. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de dados MySQL
DB_ROOT_PASSWORD=senha_forte_aqui
DB_NAME=e_agenda
DB_USER=e_agenda
DB_PASSWORD=senha_segura_aqui
```

> **Nota:** Você pode manter os valores padrão ou alterá-los conforme necessário

### 3. Inicie os containers
```bash
docker-compose up -d
```

## ✅ Verificando a instalação
Após a inicialização, verifique o status do container:

```bash
docker-compose ps
```

O serviço `e_agenda_db` deve estar com status `healthy`.

## 🔧 Variáveis de Ambiente

| Variável          | Descrição                          | Valor Padrão   |
|-------------------|------------------------------------|----------------|
| DB_ROOT_PASSWORD  | Senha do root do MySQL             | root_default   |
| DB_NAME           | Nome do banco de dados             | e_agenda       |
| DB_USER           | Usuário do banco de dados          | e_agenda       |
| DB_PASSWORD       | Senha do usuário do banco          | e_agenda       |

## 📂 Estrutura de Volumes
O Docker Compose cria dois volumes persistentes:
1. `mysql_data`: Armazena os dados do MySQL
2. Configurações personalizadas via `my.cnf`

## ⚙️ Configuração Personalizada
O arquivo `my.cnf` permite ajustes específicos do MySQL. Edite-o conforme necessário:

```ini
[mysqld]
default-authentication-plugin=mysql_native_password
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```

## 🐳 Comandos Úteis

| Comando                          | Descrição                               |
|----------------------------------|-----------------------------------------|
| `docker-compose up -d`           | Inicia os serviços em background        |
| `docker-compose down`            | Para e remove os containers             |
| `docker-compose logs -f db`      | Visualiza logs do MySQL                 |
| `docker exec -it e_agenda_db bash` | Acessa o container do MySQL           |

## 🔄 Banco de Dados Inicial
O arquivo `init.sql` na pasta raiz será executado na primeira inicialização para:
- Criar tabelas básicas
- Inserir dados iniciais
- Configurar privilégios
