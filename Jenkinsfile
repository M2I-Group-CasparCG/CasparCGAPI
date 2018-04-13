pipeline {
  agent any
  stages {
    stage('Install appli') {
      parallel {
        stage('Install appli') {
          steps {
            sh 'npm install'
          }
        }
        stage('git pull') {
          steps {
            sh 'git pull'
          }
        }
      }
    }
    stage('Test appli') {
      steps {
        sh 'npm test'
      }
    }
    stage('Launch appli') {
      parallel {
        stage('Launch appli') {
          steps {
            sh 'npm start run'
          }
        }
        stage('error') {
          steps {
            sleep 30
            sh 'npm stop'
          }
        }
      }
    }
    stage('npm stop') {
      steps {
        sh 'npm stop'
      }
    }
  }
}