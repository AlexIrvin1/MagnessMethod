document.addEventListener('DOMContentLoaded', () => {
    const mpwSlider = document.getElementById('mpw-slider');
    const maxlrSlider = document.getElementById('maxlr-slider');
    const maxlwSlider = document.getElementById('maxlw-slider');
    const mpwValue = document.getElementById('mpw-value');
    const maxlrValue = document.getElementById('maxlr-value');
    const maxlwValue = document.getElementById('maxlw-value');

    const scheduleContainer = document.getElementById('schedule-container');
    const dynamicNotes = document.getElementById('dynamic-notes');

    const aerobicStat = document.getElementById('aerobic-stat');
    const qualityStat = document.getElementById('quality-stat');
    const frequencyStat = document.getElementById('frequency-stat');

    function generatePlan(mpw, maxLr, maxLw) {
        // Base percentages
        let sunday = Math.min(mpw * 0.25, maxLr); // Up to 25%, capped
        // Ensure sunday isn't artificially low if they set a weird max
        if (sunday < mpw * 0.15) sunday = mpw * 0.15;

        let wednesday = Math.min(mpw * 0.15, maxLw); // Medium Long 12-15%, capped at maxLw

        // Quality days (Strictly ≤ 20% total volume combined)
        let maxQuality = mpw * 0.20;
        let tuesdayTotal = maxQuality / 2;
        let fridayTotal = maxQuality / 2;

        // Double Threshold Logic
        let isDoubleThreshold = mpw >= 85;

        // Structured Quality Volumes (Accounting for 4mi total w/u and c/d per session)
        // If double threshold, both AM and PM get w/u & c/d.
        let tueAm = isDoubleThreshold ? Math.max(8, (tuesdayTotal * 0.65) + 4) : Math.max(8, tuesdayTotal + 4);
        let tuePm = isDoubleThreshold ? Math.max(6, (tuesdayTotal * 0.35) + 4) : 0;
        let friAm = isDoubleThreshold ? Math.max(8, (fridayTotal * 0.65) + 4) : Math.max(8, fridayTotal + 4);
        let friPm = isDoubleThreshold ? Math.max(6, (fridayTotal * 0.35) + 4) : 0;

        // Doubles logic (Aerobic Density)
        let mondayDouble = 0;
        let thursdayDouble = 0;
        let tuesdayDouble = 0;
        let saturdayDouble = 0;
        let doublesCount = 0;

        // Add easy doubles progressively as mileage increases
        if (mpw >= 65) { mondayDouble = 4; doublesCount++; }
        if (mpw >= 75) { thursdayDouble = 4; doublesCount++; }
        if (mpw >= 85 && !isDoubleThreshold) { tuesdayDouble = 4; doublesCount++; } // Only if not already doing double threshold
        if (mpw >= 100) { saturdayDouble = 4; doublesCount++; }

        if (isDoubleThreshold) {
            // Tuesday and Friday will each have 2 runs, intrinsically adding 2 doubles
            doublesCount += 2;
        }

        // Remaining volume for easy/single runs
        let baseRemaining = mpw - sunday - wednesday - tueAm - tuePm - friAm - friPm - mondayDouble - thursdayDouble - tuesdayDouble - saturdayDouble;

        // Distribute remaining to main easy days
        let monday = baseRemaining / 3;
        let thursday = baseRemaining / 3;
        let saturday = baseRemaining / 3;

        // Cap single easy runs at 8 miles, spill over to double
        if (monday > 8) {
            if (mondayDouble === 0) doublesCount++;
            mondayDouble += (monday - 8);
            monday = 8;
        }
        if (thursday > 8) {
            if (thursdayDouble === 0) doublesCount++;
            thursdayDouble += (thursday - 8);
            thursday = 8;
        }
        if (saturday > 8) {
            if (saturdayDouble === 0) doublesCount++;
            saturdayDouble += (saturday - 8);
            saturday = 8;
        }

        // Create unrounded plan structure
        const plan = [
            {
                day: 'Monday',
                type: 'Easy + Speed',
                theme: 'type-easy',
                runs: [
                    ...(mondayDouble ? [{ name: 'AM Shakeout', miles: mondayDouble, desc: 'Very relaxed, aerobic density' }] : []),
                    { name: mondayDouble ? 'PM Easy' : 'Easy Run', miles: monday, desc: 'Conversational pace + 4-6x Strides for economy' }
                ]
            },
            {
                day: 'Tuesday',
                type: 'Workout',
                theme: 'type-quality',
                runs: isDoubleThreshold ? [
                    { name: 'AM Threshold', miles: tueAm, desc: '2mi w/u, longer reps (>1k), 2mi c/d.' },
                    { name: 'PM Threshold', miles: tuePm, desc: '2mi w/u, shorter reps (≤1k), 2mi c/d.' }
                ] : [
                    ...(tuesdayDouble ? [{ name: 'AM Shakeout', miles: tuesdayDouble, desc: 'Very relaxed, aerobic density' }] : []),
                    { name: 'Threshold Session', miles: tueAm, desc: '2mi w/u, Cruise intervals or tempo, 2mi c/d.' }
                ]
            },
            {
                day: 'Wednesday',
                type: 'Med-Long',
                theme: 'type-moderate',
                runs: [
                    { name: 'Midweek Anchor', miles: wednesday, desc: 'HR Capped. Not within 24h of hardest session if possible.' }
                ]
            },
            {
                day: 'Thursday',
                type: 'Easy + Speed',
                theme: 'type-easy',
                runs: [
                    ...(thursdayDouble ? [{ name: 'AM Shakeout', miles: thursdayDouble, desc: 'Very relaxed, aerobic density' }] : []),
                    { name: thursdayDouble ? 'PM Easy' : 'Easy Run', miles: thursday, desc: 'Recovery focused + 4-6x Strides for economy' }
                ]
            },
            {
                day: 'Friday',
                type: 'Workout',
                theme: 'type-quality',
                runs: isDoubleThreshold ? [
                    { name: 'AM Threshold', miles: friAm, desc: '2mi w/u, longer reps (>1k), 2mi c/d.' },
                    { name: 'PM Threshold', miles: friPm, desc: '2mi w/u, shorter reps (≤1k), 2mi c/d.' }
                ] : [
                    { name: 'Speed / CV', miles: friAm, desc: '2mi w/u, CV pacing, 2mi c/d.' }
                ]
            },
            {
                day: ' শনিবার', // Will correct this to Saturday below
                day: 'Saturday',
                type: 'Easy + Hills',
                theme: 'type-easy',
                runs: [
                    ...(saturdayDouble ? [{ name: 'AM Shakeout', miles: saturdayDouble, desc: 'Very relaxed, aerobic density' }] : []),
                    { name: saturdayDouble ? 'PM Easy' : 'Easy Run', miles: saturday, desc: 'Conversational pace + Short Hill Sprints' }
                ]
            },
            {
                day: 'Sunday',
                type: 'Long Run',
                theme: 'type-long',
                runs: [
                    { name: 'Aerobic Anchor', miles: sunday, desc: 'Every other week: add light stimulus (last 20min steady / CV insertions).' }
                ]
            }
        ];

        // Normalize rounding to ensure exact MPW
        let totalAssigned = 0;
        plan.forEach(day => {
            day.runs.forEach(run => {
                run.miles = Math.round(run.miles);
                totalAssigned += run.miles;
            });
        });

        // Adjust any rounding differences on Saturday easy run to perfectly hit mileage
        let diff = mpw - totalAssigned;
        if (diff !== 0) {
            // Find saturday main run
            const satRuns = plan.find(d => d.day === 'Saturday').runs;
            satRuns[satRuns.length - 1].miles += diff;

            // Prevent negative miles if user selects crazy values
            if (satRuns[satRuns.length - 1].miles < 0) {
                const remainder = satRuns[satRuns.length - 1].miles;
                satRuns[satRuns.length - 1].miles = 0;
                plan.find(d => d.day === 'Monday').runs[plan.find(d => d.day === 'Monday').runs.length - 1].miles += remainder;
            }
        }

        // Calculate daily totals
        plan.forEach(day => {
            day.total = day.runs.reduce((sum, run) => sum + run.miles, 0);
        });

        let totalQuality = plan.find(d => d.day === 'Tuesday').total + plan.find(d => d.day === 'Friday').total;
        let totalAerobic = mpw - totalQuality; // Simplified allocation for stats

        return { plan, doublesCount, totalQuality, totalAerobic };
    }

    function renderApp() {
        const mpw = parseInt(mpwSlider.value, 10);
        const maxLr = parseInt(maxlrSlider.value, 10);
        const maxLw = parseInt(maxlwSlider.value, 10);

        mpwValue.innerText = mpw;
        maxlrValue.innerText = maxLr;
        maxlwValue.innerText = maxLw;

        const { plan, doublesCount, totalQuality, totalAerobic } = generatePlan(mpw, maxLr, maxLw);

        // Update stats
        const qPct = Math.round((totalQuality / mpw) * 100);
        const aPct = 100 - qPct;

        aerobicStat.innerText = `${aPct}%`;
        qualityStat.innerText = `${qPct}%`;
        frequencyStat.innerText = 7 + doublesCount;

        // Render Schedule
        scheduleContainer.innerHTML = '';
        plan.forEach(day => {
            const card = document.createElement('div');
            card.className = `day-card ${day.theme}`;

            let runsHTML = day.runs.map(run => `
                <div class="run-phase">
                    <div class="phase-value">${run.miles} <span style="font-size:0.8rem;color:var(--text-secondary);">mi</span></div>
                    <div class="phase-name">${run.name}</div>
                    <div class="phase-desc">${run.desc}</div>
                </div>
            `).join('');

            card.innerHTML = `
                <div class="day-header">
                    <div class="day-name">${day.day}</div>
                    <div class="run-type">${day.type}</div>
                </div>
                <div class="run-details">
                    ${runsHTML}
                </div>
                <div class="mileage-total-container">
                    <span class="total-label">Day Total</span>
                    <span class="mileage-total">${day.total}</span>
                </div>
            `;
            scheduleContainer.appendChild(card);
        });

        // Render dynamic notes based on Magness philosophy and current mileage
        dynamicNotes.innerHTML = '';
        const notes = [];

        notes.push("<strong>80-90% Aerobic Rule:</strong> Quality is strictly capped at ≤ 20% to prevent gray-zone burnout.");

        if (mpw >= 85) {
            notes.push(`<strong>Double Threshold Logic:</strong> At ${mpw} mpw, Tuesday and Friday convert to Double Threshold. AM reps > 1k, PM reps ≤ 1k. Combined lactate volume capped.`);
        }

        notes.push("<strong>Neuromuscular Economy:</strong> Strides included 2x weekly (Mon/Thu). Short Hill Sprints 1x weekly (Saturday). If no fast running for 10+ days, insert economy work.");

        notes.push(`<strong>Medium Long Run (12-15%):</strong> The ${plan.find(d => d.day === 'Wednesday').total}-mile MLR on Wednesday should be HR-capped and ideally not within 24h of your hardest session.`);

        if (maxLr < mpw * 0.2) {
            notes.push(`<strong>Long Run Anchor:</strong> You've capped your long run tightly (${maxLr} mi). This is safe, though standard is 20-25%. Every other week, add a light stimulus (e.g., last 20min steady).`);
        }

        notes.push("<strong>Hard Day Spacing:</strong> Ensure a minimum of 48 hours between VO2 or Race-pace sessions. AM/PM Double Threshold counts as ONE stress day.");

        notes.push("<strong>Mileage Progression Rule:</strong> Non-negotiable: Increase mileage ≤ 8-10% weekly. Take an 85-90% deload every 4th week. Long run increases ≤ 2 miles per week.");

        notes.forEach(note => {
            const li = document.createElement('li');
            li.innerHTML = note;
            dynamicNotes.appendChild(li);
        });
    }

    // Listeners
    mpwSlider.addEventListener('input', renderApp);
    maxlrSlider.addEventListener('input', renderApp);
    maxlwSlider.addEventListener('input', renderApp);

    // Initial Render
    renderApp();
});
