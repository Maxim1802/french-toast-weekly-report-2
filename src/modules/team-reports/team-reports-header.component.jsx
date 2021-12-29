import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TeamSelector } from '../common/components/topbar/team-selector.component';
import { TeamReportsNumberAvatar } from './team-reports-number-avatar.component';
import { AvatarComponent } from '../common/components/avatar/avatar.component';
import { useStore } from 'effector-react';
import { reportsStore } from '../store/weekly-report-store';
import { OldPeriodReports } from '../store/old-reports-store';
import { matchPath, useLocation, useSearchParams } from 'react-router-dom';

export function TeamReportsHeader({ maxAvatarsDisplayed = 4 }) {
    const reports = useStore(reportsStore);
    const oldReports = useStore(OldPeriodReports);
    let [searchParams] = useSearchParams();

    let members = reports;
    if (
        searchParams.get('filter') !== null &&
        oldReports?.overviewReportsDtos
    ) {
        members = oldReports?.overviewReportsDtos;
    }

    let hasSomeWeeklyReports = members.length > 0;
    let avatarRowElements = [];
    for (let i = 0; i < Math.min(members.length, maxAvatarsDisplayed); ++i) {
        avatarRowElements.push(
            <div
                className='col'
                style={{
                    zIndex: `${maxAvatarsDisplayed - i}`,
                    transform: `translate(${
                        // TODO: This magic is not correct for values less than 4, need fix
                        100 - (100 / maxAvatarsDisplayed) * (i + 2)
                    }%)`,
                }}>
                <AvatarComponent
                    lastName={members[i].lastName}
                    firstName={members[i].firstName}
                    avatarPath={members[i].avatarPath}
                />
            </div>
        );
    }
    if (members.length > maxAvatarsDisplayed) {
        avatarRowElements.push(
            <div
                className='col'
                style={{
                    zIndex: `${maxAvatarsDisplayed + 1}`,
                    transform: `translate(${-200 / maxAvatarsDisplayed}%)`,
                }}>
                <TeamReportsNumberAvatar
                    number={members.length - maxAvatarsDisplayed}
                />
            </div>
        );
    }

    return (
        <header className='d-flex flex-column justify-content-between align-items-center text-light p-4 bg-dark'>
            <TeamSelector />
            {searchParams.has('team') ? (
                <div className='d-flex flex-column justify-content-between align-items-center text-light'>
                    <div className='row gx-0 mt-2'>{avatarRowElements}</div>
                    <h2 className='mt-4'>
                        Your team{' '}
                        <strong>
                            has {hasSomeWeeklyReports ? '' : 'not '}submitted
                            reports
                        </strong>{' '}
                        this week.
                    </h2>
                </div>
            ) : (
                <div className='d-flex flex-column justify-content-between align-items-center text-light'>
                    <h1 className='my-2'>Weekly report history</h1>
                    <h4 className='mt-3'>
                        Get a bigger picture of how your tem has been doing over
                        time.
                    </h4>
                </div>
            )}
        </header>
    );
}

TeamReportsHeader.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string.isRequired,
            avatarPath: PropTypes.string,
            weeklyInformation: PropTypes.arrayOf(
                PropTypes.shape({
                    stateName: PropTypes.string,
                    stateLevel: PropTypes.number,
                    comments: PropTypes.string,
                })
            ),
            weeklyNotations: PropTypes.arrayOf(
                PropTypes.shape({
                    text: PropTypes.string,
                    title: PropTypes.string,
                })
            ),
        })
    ),
    maxAvatarsDisplayed: PropTypes.number,
};
