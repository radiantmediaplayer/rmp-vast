const result = document.getElementById('result');

function getPlayerVersion() {
  return new Promise(resolve => {
    fetch(`http://localhost/rmp-vast/package.json`).
      then(response => {
        return response.json();
      }).
      then(json => {
        resolve(json.version);
      });
  });
}


function appendCtrfData(playerVersion, browser) {
  return new Promise(resolve => {
    fetch(`http://localhost/rmp-vast/test/report/v${playerVersion}/ctrf-${browser}.json`).
      then(response => {
        return response.json();
      }).
      then(json => {
        const summary = json.results.summary;

        const header = document.createElement('h1');
        header.textContent = `Test results for rmp-vast version ${playerVersion}`;
        result.appendChild(header);

        const p1 = document.createElement('p');
        p1.textContent = `tests ran : ${summary.tests}`;
        result.appendChild(p1);

        const p2 = document.createElement('p');
        p2.textContent = `tests passed : ${summary.passed}`;
        result.appendChild(p2);

        const p3 = document.createElement('p');
        p3.textContent = `tests failed : ${summary.failed}`;
        result.appendChild(p3);

        const duration = Math.round((summary.stop - summary.start) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration - (minutes * 60);
        const p4 = document.createElement('p');
        p4.textContent = `tests duration : ${duration} seconds | ${minutes} minutes and ${seconds} seconds`;
        result.appendChild(p4);

        const failedTests = json.results.tests.filter(test => {
          return test.status !== 'passed';
        });
        const ul = document.createElement('ul');
        ul.className = 'list-group';
        if (failedTests.length === 0) {
          const li = document.createElement('li');
          li.className = 'bg-success text-white fw-bold list-group-item';
          li.textContent = `ALL TESTS PASSED!`;
          ul.appendChild(li);
          result.appendChild(ul);
          return;
        }
        failedTests.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        failedTests.forEach(failedTest => {
          const li = document.createElement('li');
          li.className = 'bg-danger text-white fw-bold list-group-item';
          li.textContent = `${failedTest.name} FAILED`;
          ul.appendChild(li);
        });
        result.appendChild(ul);
        resolve();
      });
  });
}

async function runReport() {
  const playerVersion = await getPlayerVersion();
  await appendCtrfData(playerVersion, 'chrome');
}

runReport();
