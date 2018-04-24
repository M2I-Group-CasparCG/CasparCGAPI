pipeline {
  agent any
  stages {
    stage('Init appli') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test cover code') {
      steps {
        sh 'npm test'
      }
    }
    stage('Test API') {
      parallel {
        stage('slepp 1min30') {
          steps {
            sleep(unit: 'SECONDS', time: 90)
          }
        }
        stage('run dev') {
          steps {
            sh 'npm run run_dev'
          }
        }
        stage('sleep 10sec & newman run') {
          steps {
            sleep 10
            sh 'newman run utilities/API/CasparCG\\ api.postman_collection.json'
          }
        }
      }
    }
    stage('Stop node') {
      steps {
        sh 'pkill node'
      }
    }
  }
}