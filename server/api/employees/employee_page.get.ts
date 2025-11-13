import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const supabase = createClient(
    runtimeConfig.public.supabaseUrl,
    runtimeConfig.public.supabaseServiceRoleKey
  );

  const { id } = getQuery(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing employee ID" });
  }

  try {
    // 1. Fetch EMployee
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (employeeError) {
      throw createError({ statusCode: 500, message: employeeError.message });
    }

    // 1. Fetch Attendance
    const { data: attendance, error: attendanceError } = await supabase
      .from("attendance")
      .select("id, date, check_in, check_out")
      .eq("employee_id", id);

    if (attendanceError) {
      throw createError({ statusCode: 500, message: attendanceError.message });
    }
    return {
      success: true,
      data: {
        employee,
        attendance,
      },
    };
  } catch (err) {
    console.error(`Error fetching employee with id ${id}:`, err);
    return { success: false, message: "Internal Server Error" };
  }
});
