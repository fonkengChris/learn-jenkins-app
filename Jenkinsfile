
pipeline {
    agent any

    stages {
        stage('Cleanup') {
            steps {
                // Force-clean the workspace before each build
                deleteDir()
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    // Run Docker as the Jenkins user, not root
                    args '-u $(id -u):$(id -g)'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    args '-u $(id -u):$(id -g)'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm ci
                    npm test
                '''
            }
        }

        stage('E2E') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                    args '-u $(id -u):$(id -g)'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm install serve
                    node_modules/.bin/serve -s build &
                    sleep 10
                    npx playwright test
                '''
            }
        }
    }

    post {
        always {
            // Clean up test results and workspace safely
            junit 'test-results/junit.xml'
            deleteDir()
        }
    }
}
