'use client'

import {useAPI} from "@/app/util/client";
import {Project, User} from "@/app/util/db";
import {roleIn, targetURL} from "@/app/util/projects";
import {Suspense} from "react";
import {Loading} from "@/app/util/components";

export default function Dashboard() {
    const [UserProvider, user, refreshUserData] = useAPI<User>(
        "auth/user_data",
        {method: "POST"},
        "/dashboard",
    );

    return (
        <main>
            <UserProvider width={500} height={500}>
                <h1>{user!.pseudo}'s projects</h1>
                <button onClick={refreshUserData}>Refresh</button>
                <div>
                    {user!.projects ? user!.projects.map((project, index) => (
                            <Suspense key={index} fallback={<Loading height={200} width={1000}/>}>
                                <ProjectDiv id={project}/>
                            </Suspense>
                        )) :
                        <p>You don't have any projects for now</p>}
                    <button>Create a project</button>
                    <button>Join an already existent project</button>
                </div>
            </UserProvider>
        </main>
    );

    async function ProjectDiv({id}: {id: number}) {
        const project: Project = await (await fetch(`/api/projects`, {
            method: "POST",
            body: JSON.stringify({ id }),
        })).json();

        return (
            <div>
                <div>
                    <span>{project.name}</span>
                    <span>{project.id}</span>
                </div>
                <p>{targetURL(project)}</p>
                <p>{roleIn(user!.id, project)}</p>
                {/* TODO <Image src={poject.isPublic ? "" : ""} width={500} height={500} /> */}
            </div>
        );
    }
}