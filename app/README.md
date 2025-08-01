# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration and updating

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### additional features using Docker and cloud deployment on Azure using Terraform for Infrastructure as Code (IaC).







# Phase 2 Phase 2 -IaC, Containerization & Manual Deployment

## Project Overview

This is a personal tracker application built with React, focusing purely on the frontend. This project demonstrates containerization using Docker and cloud deployment on Azure using Terraform for Infrastructure as Code (IaC).

## Technologies Used

* **Frontend:** React.js
* **Containerization:** Docker, Nginx
* **Cloud Provider:** Microsoft Azure
* **Infrastructure as Code:** Terraform
* **Version Control:** Git, GitHub

## Local Development Setup (Containerized)

To get the application running locally in a containerized environment:

**Prerequisites:**

* [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

**Steps:**

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/angep72/Devops-summative.git](https://github.com/angep72/Devops-summative.git)
    cd app
    ```
2.  **Build and Run with Docker Compose:**
    Ensure you are in the root directory of the project (where `docker-compose.yml` and `Dockerfile` are located).
    ```bash
    docker-compose up --build
    ```
    This command will:
    * Build the React application inside a Docker container (using the `Dockerfile`).
    * Set up an Nginx server to serve the built React static files.
    * Expose the application on port 80.
3.  **Access the Application:**
    Open your web browser and navigate to:
    `http://localhost:80`

## Cloud Deployment (Azure)

This application is deployed to Azure using Terraform to provision the necessary infrastructure and Docker for containerization.

**Deployment Architecture:**

* **Azure Container Registry (ACR):** Stores the Docker image of the React application.
* **Azure App Service Plan:** Provides the underlying compute resources.
* **Azure App Service for Containers:** Hosts the containerized React application and exposes it via a public URL.

**Prerequisites for Cloud Deployment:**

* An Azure Subscription.
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed.
* [Terraform](https://www.terraform.io/downloads.html) installed.
* [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.

### Infrastructure Provisioning with Terraform

1.  **Azure Authentication:**
    Log in to your Azure account via the CLI. This provides the necessary credentials for Terraform.
    ```bash
    az login
    # If you have multiple Azure subscriptions, set the correct one:
    # az account set --subscription "Your Subscription Name or ID or GUID"
    ```
2.  **Prepare Terraform Backend:**
    Terraform state is managed in an Azure Storage Account. **Before proceeding**, ensure you have an Azure Storage Account and a Blob Container created to store your Terraform state.
    * **Resource Group for State:** `tfstate-rg` (e.g., in "East US")
    * **Storage Account Name:** `youruniqueterraformstate` (globally unique, lowercase)
    * **Blob Container Name:** `tfstate`
    * Update `terraform/backend.tf` with these names.
    (Refer to the detailed instructions in `phase.md` or previous guidance on how to create these manually via Azure CLI or Portal).
3.  **Navigate to Terraform Directory:**
    ```bash
    cd terraform
    ```
4.  **Initialize Terraform:**
    This downloads the Azure provider and configures the remote backend.
    ```bash
    terraform init
    ```
    *Confirm backend initialization when prompted.*
5.  **Review Proposed Changes:**
    Always run a plan to see what Terraform intends to create, modify, or destroy.
    ```bash
    terraform plan
    ```
6.  **Apply Infrastructure:**
    Apply the plan to provision the Azure resources.
    ```bash
    terraform apply
    ```
    *Type `yes` to confirm the operation.*
    This will create the Azure Resource Group, Container Registry, App Service Plan, and App Service.

### Manual Application Deployment

Once the Azure infrastructure is provisioned, you'll build your Docker image and push it to your Azure Container Registry. Azure App Service will then pull and run this image.

1.  **Navigate to Project Root:**
    ```bash
    cd .. # Go back to the main project directory
    ```
2.  **Build Docker Image for Deployment:**
    ```bash
    docker build -t personal-tracker-frontend-image:latest .
 .
    ```
3.  **Get ACR Login Server:**
    You'll need the login server name for your Azure Container Registry.
    ```bash
    cd terraform
    terraform output acr_login_server
    cd .. # Go back to the main project directory
    ```
    *(Example output: `youruniqueterraformstate.azurecr.io`)*
4.  **Authenticate Docker with ACR:**
    This uses your `az login` credentials to allow Docker to push to your ACR.
    ```bash
    az acr login --name personaltrackerfrontendacr 
    ```
5.  **Tag Your Docker Image:**
    Tag your local image with the full path to your ACR.
    ```bash
    docker tag personaltrackerfrontendacr.azurecr.io/personal-tracker-frontend-image:latest personal-tracker-frontend-image:latest

    ```
   
6.  **Push Image to ACR:**
    ```bash
    docker push personaltrackerfrontendacr.azurecr.io/personal-tracker-frontend-image:latest
    ```
7.  **Verify Deployment in Azure App Service:**
    Azure App Service is configured to automatically pull the `latest` image from your ACR.
    * Go to the Azure Portal, navigate to your App Service (`personal-tracker-frontend-service`).
    * Check the "Overview" page for its status. It might show "Restarting" briefly as it pulls the new image.
    * You can also check "Deployment Center" or "Log stream" for more details.

## Live Application URL

Once successfully deployed, your application will be accessible at the following public URL:

`https://personal-tracker-frontend-service.azurewebsites.net/`


## Screenshots of Provisioned Resources

Please see the `phase.md` file for screenshots of the deployed Azure resources.

## Peer Review

A link to the Pull Request I reviewed for my peer:

`https://github.com/mbienaimee/todo-devops/pull/27`

## Reflection

Please see the `phase.md` file for a brief reflection on the challenges encountered.

---
