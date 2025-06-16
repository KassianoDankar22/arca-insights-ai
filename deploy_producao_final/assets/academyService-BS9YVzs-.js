import{s as o}from"./index-DpL_m2zY.js";const _={async getAllCourses(){const{data:r,error:e}=await o.from("courses").select("*").order("created_at",{ascending:!1});if(e)throw e;return r},async getCourseById(r){const{data:e,error:t}=await o.from("courses").select("*").eq("id",r).single();if(t)throw t;return e},async getCourseModules(r){const{data:e,error:t}=await o.from("course_modules").select(`
        *,
        course_lessons (
          *,
          lesson_progress (
            completed,
            progress,
            last_watched
          )
        )
      `).eq("course_id",r).order("order_index",{ascending:!0});if(t)throw t;return e.map(n=>({...n,lessons:n.course_lessons.sort((a,s)=>a.order_index-s.order_index).map(a=>{var s,i,c,u;return{...a,completed:((i=(s=a.lesson_progress)==null?void 0:s[0])==null?void 0:i.completed)||!1,progress:((u=(c=a.lesson_progress)==null?void 0:c[0])==null?void 0:u.progress)||0}})}))},async updateLessonProgress(r,e,t=!1){var a;const{data:d,error:n}=await o.from("lesson_progress").select("*").eq("lesson_id",r).eq("user_id",o.auth.getUser().then(({data:s})=>{var i;return(i=s.user)==null?void 0:i.id})).single();if(n&&n.code!=="PGRST116")throw n;if(d){const{error:s}=await o.from("lesson_progress").update({progress:e,completed:t,last_watched:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",d.id);if(s)throw s}else{const{error:s}=await o.from("lesson_progress").insert({lesson_id:r,user_id:(a=(await o.auth.getUser()).data.user)==null?void 0:a.id,progress:e,completed:t,last_watched:new Date().toISOString()});if(s)throw s}},async getCourseProgress(r){var d;const{data:e,error:t}=await o.rpc("calculate_course_progress",{p_course_id:r,p_user_id:(d=(await o.auth.getUser()).data.user)==null?void 0:d.id});if(t)throw t;return e},async getAcademyStats(){const{data:r,error:e}=await o.rpc("get_academy_stats");if(e)throw e;return r}};export{_ as a};
