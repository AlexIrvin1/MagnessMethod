document.addEventListener('DOMContentLoaded', () => {
    const mpwSlider = document.getElementById('mpw-slider');
    const maxlrSlider = document.getElementById('maxlr-slider');
    const maxlwSlider = document.getElementById('maxlw-slider');
    const mpwValue = document.getElementById('mpw-value');
    const maxlrValue = document.getElementById('maxlr-value');
    const maxlwValue = document.getElementById('maxlw-value');

    const scheduleContainer = document.getElementById('schedule-container');

    const phaseSelect = document.getElementById('phase-select');
    const eventSelect = document.getElementById('event-select');
    const dtCheckbox = document.getElementById('double-threshold-checkbox');

    // Workout Catalog (Phase-Based)
    const workoutLibrary = {
        base: {
            // Focus: Aerobic development, very light aerobic threshold, strides
            primary: [
                { name: 'Light Fartlek', desc: '10x 1min on / 1min off (effort: 5k pace)' },
                { name: 'Aerobic Threshold', desc: '4 x 1 mile at Marathon Pace w/ 60s jog' },
                { name: 'Progression Run', desc: 'Start easy, last 15 mins at HMP' },
                { name: 'Mona Fartlek', desc: '2x90s, 4x60s, 4x30s, 4x15s (equal jog recovery)' },
                { name: 'Steady State', desc: '5 miles continuous at steady, comfortable effort' },
                { name: 'Hill Flow', desc: '8x 45s moderate hills, jog down immediately' },
                { name: 'Alternations', desc: '3 miles alternating: 400m @ HMP, 400m Easy' },
                { name: 'Tempo Intervals', desc: '3 x 10 mins @ MP/HMP effort, 2 min jog' }
            ],
            secondary: [
                { name: 'Hill Sprints', desc: '10x 10sec max effort steep hills, full recovery' },
                { name: 'Speed Play', desc: '8x 30sec fast, 90sec jog' },
                { name: 'Strides', desc: '8-10x 100m strides during easy run' },
                { name: 'Light CV', desc: '6x 400m @ CV effort, 60s jog' },
                { name: 'Hills & Flats', desc: '4x 30s hill sprint, 4x 200m fast on flat' },
                { name: 'Economy Work', desc: '10x 200m @ 3k pace, 200m jog' },
                { name: 'Turnover', desc: '6x 1min quick turnover, 2min shuffle jog' }
            ]
        },
        strength: {
            // Focus: CV, long hills, early threshold
            primary: [
                { name: 'True CV', desc: '6 x 1000m @ CV pace, 60-90s jog' },
                { name: 'Cruise Intervals', desc: '8 x 800m @ Threshold, 60s jog' },
                { name: 'Tempo Run', desc: '4 miles continuous @ Threshold' },
                { name: 'Long Hills', desc: '6 x 90s hard hill reps, jog down' },
                { name: 'Mixed Pace', desc: '2 mi Tempo, 4 x 400 @ 3k pace' },
                { name: 'Broken Tempo', desc: '2 x 2 miles @ Threshold, 2 min jog' },
                { name: 'CV + Hills', desc: '4 x 1k @ CV, 4 x 30s hill sprints' },
                { name: 'Over/Under', desc: '4 miles alternating: 400m slightly faster than T, 400m slightly slower' }
            ],
            secondary: [
                { name: 'Short CV', desc: '12 x 400m @ CV pace, 45s jog' },
                { name: 'Hill Circuits', desc: '3 sets: 60s hill, 40s hill, 20s hill (jog down)' },
                { name: 'Economy Reps', desc: '8 x 200m @ mile pace, 200m jog' },
                { name: 'Speed Endurance', desc: '4 x 300m hard, 100m float jog' },
                { name: 'Transition Repeats', desc: '6 x 600m: 400m @ T, last 200m @ mile pace' },
                { name: 'Fartlek Strength', desc: '5x 3min on / 1min off' },
                { name: 'Lactate Clearance', desc: '4x 1min hard, 3min moderate float' }
            ]
        },
        specific: {
            // Focus: Race pace, extreme threshold, extending intervals
            primary: [
                { name: '10k Specific', desc: '5 x 1 mile @ 10k pace, 2 min jog' },
                { name: '5k Specific', desc: '6 x 800m @ 5k pace, 90s jog' },
                { name: 'Deep Threshold', desc: '3 x 2 miles @ Threshold, 90s jog' },
                { name: 'Combo Workout', desc: '2 mi T, 4 x 600 @ 5k, 4 x 200 @ mile' },
                { name: 'Race Sim', desc: '3x 1600m (1st @ T, 2nd @ 10k, 3rd @ 5k)' },
                { name: 'Long Fartlek', desc: '6x 4min hard, 2min float (not jog)' },
                { name: 'Specific Repeats', desc: '10 x 600m @ 5k-10k pace, 60s jog' },
                { name: 'Hard Continuous', desc: '5 miles @ HMP' }
            ],
            secondary: [
                { name: 'Acid Bath', desc: '3 x 400m HARD, 3min rest' },
                { name: 'Mile Pace', desc: '10 x 300m @ mile pace, 100m jog' },
                { name: 'Sharp CV', desc: '8 x 600m @ CV pace, 60s jog' },
                { name: 'Closing Speed', desc: '4x 400m @ 1500m pace, 2min rest' },
                { name: 'Cutdowns', desc: '1k, 800m, 600m, 400m, 200m getting faster' },
                { name: 'Pace Injection', desc: '4 miles @ T, with 10 sec surge every 800m' },
                { name: 'Pure Speed', desc: '6 x 150m very fast, walk back' }
            ]
        },
        peak: {
            // Focus: Sharpening, very fast with full rest, high quality, lower volume
            primary: [
                { name: 'Sharpening Reps', desc: '8 x 400m @ 3k pace, 90s rest' },
                { name: 'Race Prep', desc: '3 x 1000m @ goal race pace, 2 min rest' },
                { name: 'Speed Tuning', desc: '5 x 600m @ slightly faster than race pace' },
                { name: 'Tune-up', desc: '2 miles @ T, 2 x 400m @ mile pace' },
                { name: 'Spark Intervals', desc: '10 x 200m @ smooth mile pace (focused on form)' },
                { name: 'Relaxed Rhythm', desc: '4 x 800m @ 5k pace, generous long rest' },
                { name: 'Peaking Fartlek', desc: '5 x 2min on / 2min off' }
            ],
            secondary: [
                { name: 'Pop Strides', desc: '4-6x 150m strides finding top gear' },
                { name: 'Activation', desc: '3x 200m @ goal pace the day before race' },
                { name: 'Form Tech', desc: 'Drills + 6x 100m walk-back' },
                { name: 'Neuromuscular', desc: '4x 60m all-out sprints, 3min recovery' },
                { name: 'Flush Fartlek', desc: '10x 30s quick/light, 90s jog' },
                { name: 'Turnover Maintenance', desc: '5x 300m smooth acceleration' }
            ]
        },
        taper: {
            // Focus: Maintain tension without residual fatigue
            primary: [
                { name: 'Light Action', desc: '2 miles @ Threshold, nothing more' },
                { name: 'Check-in', desc: '3 x 500m @ race pace, long rest' },
                { name: 'Taper Tempo', desc: '1.5 miles @ T, 2x 200m quick' },
                { name: 'Race Week Primer', desc: '2 x 800m @ 10k pace, 2 x 400m @ 5k pace' }
            ],
            secondary: [
                { name: 'Shakeout Strides', desc: '4-6x 100m relaxed strides' },
                { name: 'Pre-Race Flow', desc: '10 mins tempo, 4x 1min fast' },
                { name: 'Jog + Surges', desc: '20 min jog with 4 light surges' }
            ]
        }
    };

    function getRandomWorkout(phase, tier) {
        // Fallback if phase doesn't exist
        if (!workoutLibrary[phase]) phase = 'base';
        const list = workoutLibrary[phase][tier];
        const randomIdx = Math.floor(Math.random() * list.length);
        return list[randomIdx];
    }

    // Mileage Builder Elements
    const targetMpwInput = document.getElementById('target-mpw-input');
    const weeksToRaceInput = document.getElementById('weeks-until-race-input');
    const maxIncreaseSlider = document.getElementById('max-increase-slider');
    const maxIncreaseValue = document.getElementById('max-increase-value');
    const btnGenerateBuild = document.getElementById('btn-generate-build');
    const mileageBuilderContainer = document.getElementById('mileage-builder-container');
    const macroTableBody = document.getElementById('macro-table-body');

    // Event Lookup Table
    const eventLRRanges = {
        '800m': { min: 8, max: 10 },
        '1500m': { min: 10, max: 12 },
        '3000m': { min: 12, max: 13 },
        '5000m': { min: 13, max: 15 },
        '10000m': { min: 15, max: 17 },
        'half': { min: 16, max: 18 },
        'full': { min: 20, max: 22 }
    };
    function generatePlan(mpw, phaseOverride = null, customWorkouts = null) {
        // Double Threshold Logic
        let isDoubleThreshold = mpw >= 85 && dtCheckbox.checked;
        let doublesCount = 0;

        // Base percentages as requested:
        // Monday 13%, Tuesday 11%, Wednesday 16.5%, Thursday 11%, Friday 14%, Saturday 9%, Sunday 25.5%
        let dayShares = [];
        if (isDoubleThreshold) {
            dayShares = [
                { day: 'Monday', share: 0.10, miles: 0, active: true, order: 4 },
                { day: 'Tuesday', share: 0.18, miles: 0, active: true, order: 3 }, // Huge to absorb 4 warmups
                { day: 'Wednesday', share: 0.14, miles: 0, active: true, order: 6 },
                { day: 'Thursday', share: 0.10, miles: 0, active: true, order: 2 },
                { day: 'Friday', share: 0.18, miles: 0, active: true, order: 5 }, // Huge to absorb 4 warmups
                { day: 'Saturday', share: 0.07, miles: 0, active: true, order: 1 },
                { day: 'Sunday', share: 0.23, miles: 0, active: true, order: 7 }
            ];
        } else {
            dayShares = [
                { day: 'Monday', share: 0.12, miles: 0, active: true, order: 4 },
                { day: 'Tuesday', share: 0.15, miles: 0, active: true, order: 3 }, // Bigger interval sessions
                { day: 'Wednesday', share: 0.15, miles: 0, active: true, order: 6 },
                { day: 'Thursday', share: 0.12, miles: 0, active: true, order: 2 },
                { day: 'Friday', share: 0.15, miles: 0, active: true, order: 5 }, // Bigger interval sessions
                { day: 'Saturday', share: 0.07, miles: 0, active: true, order: 1 },
                { day: 'Sunday', share: 0.24, miles: 0, active: true, order: 7 }
            ];
        }

        // Iteratively calculate miles and drop days < 3 miles
        let valid = false;

        // Determine dynamic caps based on event and mileage
        const selectedEvent = eventSelect.value;
        const lrRange = eventLRRanges[selectedEvent] || eventLRRanges['5000m']; // fallback

        // As a simple heuristic: if they are doing very low mileage for the event, use the min cap. 
        // If they are doing high mileage, use the max cap. For now, we will just use the exact max 
        // cap of their event to prevent them from doing a 20 mile LR for an 800m plan, but allow 
        // them to hit the max if they run enough volume.

        let maxLr = lrRange.max;
        // MLR is typically ~70-75% of the Long Run
        let maxLw = Math.round(maxLr * 0.75);

        while (!valid) {
            let totalActiveShares = dayShares.filter(d => d.active).reduce((sum, d) => sum + d.share, 0);
            let anyDropped = false;

            dayShares.forEach(d => {
                if (d.active) {
                    // Redistribute mpw according to relative share of remaining active days
                    d.miles = mpw * (d.share / totalActiveShares);

                    // Apply user caps
                    if (d.day === 'Sunday') d.miles = Math.min(d.miles, maxLr);
                    if (d.day === 'Wednesday') d.miles = Math.min(d.miles, maxLw);
                } else {
                    d.miles = 0;
                }
            });

            // Check if any active day is under 3 miles (and we aren't at extreme low overall mileage)
            // Drop the lowest priority day that is under 3 miles
            let lowestPriorityActiveUnder3 = dayShares
                .filter(d => d.active && d.miles > 0 && d.miles < 3)
                .sort((a, b) => a.order - b.order)[0];

            if (lowestPriorityActiveUnder3 && mpw >= 3) {
                lowestPriorityActiveUnder3.active = false;
                anyDropped = true;
            }

            if (!anyDropped) valid = true;
        }

        // Round to exact integers and adjust to hit exact mpw
        let totalAssigned = 0;
        dayShares.forEach(d => {
            if (d.active) {
                d.miles = Math.round(d.miles);
                totalAssigned += d.miles;
            }
        });

        // Fix rounding differences by adjusting the Long Run (Sunday) or MLR (Wednesday)
        let diff = mpw - totalAssigned;
        if (diff !== 0) {
            // Prioritize adjusting the Long Run, then MLR, then any other active day
            let targetDay = dayShares.find(d => d.day === 'Sunday' && d.active);
            if (!targetDay) targetDay = dayShares.find(d => d.day === 'Wednesday' && d.active);
            if (!targetDay) targetDay = dayShares.find(d => d.active); // Fallback to any active day

            if (targetDay) {
                // Ensure adjustment doesn't exceed event caps
                if (targetDay.day === 'Sunday') {
                    targetDay.miles = Math.min(targetDay.miles + diff, maxLr);
                } else if (targetDay.day === 'Wednesday') {
                    targetDay.miles = Math.min(targetDay.miles + diff, maxLw);
                } else {
                    targetDay.miles += diff;
                }
            }
        }

        // Extract daily totals
        let sunday = dayShares.find(d => d.day === 'Sunday').miles;
        let wednesday = dayShares.find(d => d.day === 'Wednesday').miles;
        let tuesdayTotal = dayShares.find(d => d.day === 'Tuesday').miles;
        let fridayTotal = dayShares.find(d => d.day === 'Friday').miles;
        let monday = dayShares.find(d => d.day === 'Monday').miles;
        let thursday = dayShares.find(d => d.day === 'Thursday').miles;
        let saturday = dayShares.find(d => d.day === 'Saturday').miles;

        // Doubles Logic for Quality Days (AM/PM splits)
        let tueAm = tuesdayTotal;
        let tuePm = 0;
        let friAm = fridayTotal;
        let friPm = 0;

        // If quality day is getting huge, split it, or if double threshold is active
        // The user requested: "each session should always be the same length so like 8 miles and 8 miles"
        if (isDoubleThreshold) {
            tueAm = Math.ceil(tuesdayTotal / 2);
            tuePm = tuesdayTotal - tueAm;
            friAm = Math.ceil(fridayTotal / 2);
            friPm = fridayTotal - friAm;
            if (tuePm > 0) doublesCount++;
            if (friPm > 0) doublesCount++;
        }

        // Add easy doubles progressively to Easy days if they get huge (> 8 miles)
        let mondayDouble = 0;
        let thursdayDouble = 0;
        let tuesdayDouble = 0;
        let saturdayDouble = 0;

        if (monday > 8) {
            mondayDouble = Math.floor(monday / 2);
            monday -= mondayDouble;
            doublesCount++;
        }
        if (thursday > 8) {
            thursdayDouble = Math.floor(thursday / 2);
            thursday -= thursdayDouble;
            doublesCount++;
        }
        if (saturday > 8) {
            saturdayDouble = Math.floor(saturday / 2);
            saturday -= saturdayDouble;
            doublesCount++;
        }
        // If high mileage but not double threshold, add a fluff double on Tuesday
        if (mpw >= 85 && !isDoubleThreshold && tueAm > 8) {
            tuesdayDouble = 4;
            tueAm -= 4;
            doublesCount++;
        }

        // Create unrounded plan structure
        const currentPhase = phaseOverride || phaseSelect.value;
        const mainWorkout = customWorkouts ? customWorkouts.tueWk : getRandomWorkout(currentPhase, 'primary');
        const secWorkout = customWorkouts ? customWorkouts.friWk : getRandomWorkout(currentPhase, 'secondary');

        // Let's create a slightly different PM workout if double threshold
        const pmThresholdCtx = customWorkouts ? { name: "PM Threshold", desc: "Secondary threshold reps (short intervals)" } : getRandomWorkout(currentPhase, 'secondary');
        const pmThreshold = isDoubleThreshold ? pmThresholdCtx : null;
        const pmThresholdFri = isDoubleThreshold ? pmThresholdCtx : null;

        let lrStimulus = customWorkouts ? customWorkouts.sunLr.desc : "Aerobic Anchor. Smooth and steady.";
        if (!customWorkouts) {
            if (currentPhase === 'base') lrStimulus = 'Aerobic Anchor. Every other week run the last 15-20% at Marathon Pace.';
            if (currentPhase === 'strength') lrStimulus = 'Aerobic Anchor. Incorporate 4-6x 30s hill surges in the second half.';
            if (currentPhase === 'specific') lrStimulus = 'Aerobic Anchor. Run the last 2-3 miles near Goal Race Pace.';
            if (currentPhase === 'peak') lrStimulus = 'Aerobic Anchor. Smooth and steady.';
            if (currentPhase === 'taper') lrStimulus = 'Aerobic Anchor. Easy and relaxed to absorb training.';
        }

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
                    { name: `AM ${mainWorkout.name}`, miles: tueAm, desc: `2mi w/u, ${mainWorkout.desc}, 2mi c/d.` },
                    { name: `PM ${pmThreshold.name}`, miles: tuePm, desc: `2mi w/u, ${pmThreshold.desc}, 2mi c/d.` }
                ] : [
                    ...(tuesdayDouble ? [{ name: 'AM Shakeout', miles: tuesdayDouble, desc: 'Very relaxed, aerobic density' }] : []),
                    { name: mainWorkout.name, miles: tueAm, desc: `2mi w/u, ${mainWorkout.desc}, 2mi c/d.` }
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
                    // Ensure we grab a different primary workout for Friday if possible
                    { name: `AM ${getRandomWorkout(currentPhase, 'primary').name}`, miles: friAm, desc: `2mi w/u, ${getRandomWorkout(currentPhase, 'primary').desc}, 2mi c/d.` },
                    { name: `PM ${pmThresholdFri.name}`, miles: friPm, desc: `2mi w/u, ${pmThresholdFri.desc}, 2mi c/d.` }
                ] : [
                    { name: secWorkout.name, miles: friAm, desc: `2mi w/u, ${secWorkout.desc}, 2mi c/d.` }
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
                    { name: 'Aerobic Anchor', miles: sunday, desc: lrStimulus }
                ]
            }
        ];

        // The top of the function already enforced exact integer mileage perfectly, so we don't
        // need to re-round and re-distribute diffs here for the old logic anymore. Let's remove 
        // the old redundant loop that attempts to fix rounding.

        // Remove 0-mile days from the plan entirely to show rest days
        const finalPlan = plan.filter(day => {
            let activeRuns = day.runs.filter(r => r.miles > 0);
            day.runs = activeRuns;
            return day.runs.length > 0;
        });

        // Calculate daily totals
        finalPlan.forEach(day => {
            day.total = day.runs.reduce((sum, run) => sum + run.miles, 0);
        });

        let totalQuality = (tueAm + tuePm + friAm + friPm);
        // User request: "do not count the warmup mileage for workouts towards the Quality volume percentage."
        // A single session typically has ~4 miles (2 w/u + 2 c/d). 
        // 2 quality days (Tue/Fri) = 8 miles fluff. If double threshold = 4 sessions = 16 miles fluff.
        let warmUpPadding = isDoubleThreshold ? 16 : 8;
        totalQuality = Math.max(0, totalQuality - warmUpPadding);

        let totalAerobic = mpw - totalQuality; // Simplified allocation for stats

        return { plan: finalPlan, doublesCount, totalQuality, totalAerobic };
    }

    // Listeners update slider value text
    mpwSlider.addEventListener('input', () => { mpwValue.innerText = mpwSlider.value; });

    maxIncreaseSlider.addEventListener('input', (e) => {
        maxIncreaseValue.innerText = e.target.value;
    });

    btnGenerateBuild.addEventListener('click', generateMacrocycle);

    async function generateMacrocycle() {
        const currentMpw = parseInt(mpwSlider.value, 10);
        const targetMpw = parseInt(targetMpwInput.value, 10);
        const totalWeeks = parseInt(weeksToRaceInput.value, 10);
        const maxJumpPct = parseInt(maxIncreaseSlider.value, 10) / 100;

        if (isNaN(targetMpw) || isNaN(totalWeeks) || targetMpw <= 0 || totalWeeks <= 0) {
            alert("Please enter valid positive numbers for Goal Mileage and Weeks to Race.");
            return;
        }

        // Generate Plan
        let plan = [];
        let currentVol = currentMpw;
        let consecutiveBuilds = 0;

        // If target is less than current or we don't need to build
        if (targetMpw <= currentMpw) {
            for (let i = 1; i <= totalWeeks; i++) {
                plan.push({ week: i, volume: targetMpw, status: 'peak' });
            }
        } else {
            // Need to build
            // Account for taper: assume week `totalWeeks` is Race Week (50% drop),
            // week `totalWeeks - 1` is pre-taper (25% drop).
            // This means we have `totalWeeks - 2` weeks to reach the peak.

            const weeksToBuild = Math.max(1, totalWeeks - 2);

            for (let i = 1; i <= totalWeeks; i++) {
                // Taper weeks
                if (i === totalWeeks) {
                    plan.push({ week: i, volume: Math.round(targetMpw * 0.5), status: 'taper', note: 'Race Week' });
                    continue;
                }
                if (i === totalWeeks - 1) {
                    plan.push({ week: i, volume: Math.round(targetMpw * 0.75), status: 'taper', note: 'Start Taper' });
                    continue;
                }

                if (currentVol >= targetMpw) {
                    // Already at target
                    currentVol = targetMpw;
                    // Still enforce down weeks even at peak? 
                    // To keep it simple, if we reached peak, maintain but keep down weeks.
                    consecutiveBuilds++;
                    if (consecutiveBuilds === 4) {
                        plan.push({ week: i, volume: Math.round(targetMpw * 0.8), status: 'down' });
                        consecutiveBuilds = 0;
                    } else {
                        plan.push({ week: i, volume: targetMpw, status: 'peak' });
                    }
                } else {
                    // Still building
                    consecutiveBuilds++;
                    if (consecutiveBuilds === 4) {
                        // Down week
                        const prevVol = plan[i - 2].volume; // Volume built up to
                        plan.push({ week: i, volume: Math.round(prevVol * 0.85), status: 'down' });
                        consecutiveBuilds = 0;
                    } else {
                        // Build week
                        let nextVol = Math.round(currentVol * (1 + maxJumpPct));
                        if (nextVol > targetMpw) nextVol = targetMpw;

                        // Prevent jumping too fast if there are plenty of weeks left? 
                        // It's a "max" increase, but let's just build linearly/exponentially.
                        plan.push({ week: i, volume: nextVol, status: 'build' });
                        currentVol = nextVol;
                    }
                }
            }
        }

        // Render Table Loading State
        macroTableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 2rem;">Initializing AI Generator...</td></tr>';
        mileageBuilderContainer.style.display = 'block';
        mileageBuilderContainer.scrollIntoView({ behavior: 'smooth' });

        let prevVol = currentMpw;

        // Fetch AI workouts sequentially to avoid rate limiting yourself
        for (let i = 0; i < plan.length; i++) {
            const w = plan[i];

            macroTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2rem;">Generating Week ${w.week} of ${plan.length} using OpenAI...</td></tr>`;

            let phaseOverride = document.getElementById('phase-select').value;
            if (w.status === 'down') phaseOverride = 'base';
            if (w.status === 'taper') phaseOverride = 'taper';

            let customWorkouts = null;
            try {
                const res = await fetch('http://localhost:3000/api/generate-week', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        context: `Runner training for ${eventSelect.value}. 
                        Current Weekly Volume: ${w.volume} miles. 
                        Phase: ${phaseOverride}. 
                        Week Status: ${w.status}.`
                    })
                });
                if (res.ok) {
                    customWorkouts = await res.json();
                }
            } catch (e) {
                console.error("AI Generation Error", e);
            }

            // Generate full 7-day plan array for this specific week's volume and phase
            const weekData = generatePlan(w.volume, phaseOverride, customWorkouts);
            w.weekData = weekData;
        }

        // Render actual rows
        macroTableBody.innerHTML = '';

        plan.forEach(w => {
            const tr = document.createElement('tr');
            const weekData = w.weekData;
            const weekPlan = weekData.plan;

            const formatDay = (dayName) => {
                const dayObj = weekPlan.find(d => d.day === dayName);
                if (!dayObj) return { html: '<div style="text-align:center;color:var(--text-secondary);font-size:0.85rem;padding:0.5rem 0;">Rest</div>', bg: '' };

                // Color code backgrounds
                let bgName = '';
                let border = '';
                if (dayObj.theme === 'type-easy') { bgName = 'var(--bg-easy)'; border = 'rgba(5, 242, 161, 0.15)'; }
                else if (dayObj.theme === 'type-quality') { bgName = 'var(--bg-quality)'; border = 'rgba(255, 123, 114, 0.15)'; }
                else if (dayObj.theme === 'type-long') { bgName = 'var(--bg-long)'; border = 'rgba(138, 43, 226, 0.15)'; }
                else if (dayObj.theme === 'type-moderate') { bgName = 'var(--bg-moderate)'; border = 'rgba(210, 168, 255, 0.15)'; }

                let bgStyle = bgName ? `background-color: ${bgName}; border: 1px solid ${border}; border-radius: 6px;` : '';

                // For Quality days, show the full details of the workout. For easy days, standard name is fine.
                let titles = dayObj.runs.map(r => {
                    let descHtml = (dayObj.theme === 'type-quality') ? `<span style="font-size:0.7em; color:var(--text-secondary); display:block; margin-top:1px; line-height:1.2;">${r.desc}</span>` : '';
                    return `<div style="margin-top:4px;"><strong style="color:var(--text-primary); display:block;">${r.name}</strong>${descHtml}</div>`;
                }).join('');

                const html = `<div style="margin-bottom:2px;font-weight:800;color:var(--text-primary);text-align:center;font-size:1.1rem;">${dayObj.total}<span style="font-size:0.7rem;color:var(--text-secondary);font-weight:normal;margin-left:2px;">mi</span></div><div style="font-size:0.75rem;line-height:1.2;color:var(--text-secondary);text-align:center;">${titles}</div>`;
                return { html, bg: bgStyle };
            };

            const mon = formatDay('Monday');
            const tue = formatDay('Tuesday');
            const wed = formatDay('Wednesday');
            const thu = formatDay('Thursday');
            const fri = formatDay('Friday');
            const sat = formatDay('Saturday');
            const sun = formatDay('Sunday');

            let rowBg = '';
            // Apply a subtle row background to visually distinguish down/taper weeks
            if (w.status === 'down') rowBg = 'background-color: rgba(255,255,255,0.02);';
            if (w.status === 'taper') rowBg = 'background-color: rgba(46, 204, 113, 0.05);';

            let wLabel = w.status === 'taper' && w.week === plan.length ? `Race<br/>Week` : `Week ${w.week}`;
            if (w.status === 'down') wLabel = `Down<br/>Week ${w.week}`;

            // Calculate exact Aerobic vs Quality volume specific to this week's generated load
            const qPct = Math.round((weekData.totalQuality / w.volume) * 100);
            const aPct = 100 - qPct;

            tr.innerHTML = `
                <td style="font-weight:bold; ${rowBg} text-align:center; vertical-align:middle; line-height:1.2; border-right: 1px solid rgba(255,255,255,0.05);">${wLabel}</td>
                <td style="font-weight:700; color:var(--text-primary); font-size:1.1rem; ${rowBg} text-align:center; vertical-align:middle; border-right: 1px solid rgba(255,255,255,0.05);">
                    ${w.volume}<br/>
                    <span style="font-size:0.7rem; color:var(--text-secondary); font-weight:normal; display:block; margin-top:4px;">
                        <span style="color:var(--accent-easy);">${aPct}% A</span> | <span style="color:var(--accent-quality);">${qPct}% Q</span>
                    </span>
                </td>
                <td style="${rowBg} padding: 6px; vertical-align:top;"><div style="${mon.bg} padding: 8px; height: 100%; box-sizing: border-box;">${mon.html}</div></td>
                <td style="${rowBg} padding: 6px; vertical-align:top;"><div style="${tue.bg} padding: 8px; height: 100%; box-sizing: border-box;">${tue.html}</div></td>
                <td style="${rowBg} padding: 6px; vertical-align:top;"><div style="${wed.bg} padding: 8px; height: 100%; box-sizing: border-box;">${wed.html}</div></td>
                <td style="${rowBg} padding: 6px; vertical-align:top;"><div style="${thu.bg} padding: 8px; height: 100%; box-sizing: border-box;">${thu.html}</div></td>
                <td style="${rowBg} padding: 6px; vertical-align:top;"><div style="${fri.bg} padding: 8px; height: 100%; box-sizing: border-box;">${fri.html}</div></td>
                <td style="${rowBg} padding: 6px; vertical-align:top;"><div style="${sat.bg} padding: 8px; height: 100%; box-sizing: border-box;">${sat.html}</div></td>
                <td style="${rowBg} padding: 6px; vertical-align:top;"><div style="${sun.bg} padding: 8px; height: 100%; box-sizing: border-box;">${sun.html}</div></td>
            `;
            macroTableBody.appendChild(tr);
        });

        mileageBuilderContainer.style.display = 'block';

        // Scroll to it smoothly
        mileageBuilderContainer.scrollIntoView({ behavior: 'smooth' });
    }
});
